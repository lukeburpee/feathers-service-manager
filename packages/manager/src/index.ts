import fs from 'fs-extra-promise'
import { directory, file } from 'tempy'
import readJson from 'load-json-file'
import writeJson from 'write-json-file'
import series from 'p-series'
import { cpus } from 'os'

import { default as Debug } from 'debug'

import { ServiceClass as MultiServiceClass } from '@feathers-service-manager/multi-service'

import ProcessService from '@feathers-service-manager/process-service'
import ClusterService from '@feathers-service-manager/cluster-service'
import ProxyService from '@feathers-service-manager/proxy-service'
import ManifestService from '@feathers-service-manager/manifest-service'
import RegistryService from '@feathers-service-manager/registry-service'
import LogService from '@feathers-service-manager/log-service'

const debug = Debug('@feathers-service-manager:manager')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends MultiServiceClass {
	public p!: any;
	public proxy!: any;
	public registry!: any;
	public manifest!: any;
	public cluster!: any;
	public log!: any;
	public cpus!: any;
	public proxyCount!: any;
	public buildCount!: any;
	public totalCount!: any;
	public defaultPkgTargets!: any;
	constructor(options: ServiceOptions);
	constructor(options: ManagerOptions) {
		super(options)
		this.setCpus (options)
		this.defaultPkgTargets = options.defaultPkgTargets || 'node10-linux-x64'
	}
	public async setup (app: any, path: any): Promise<any> {
		await super.setup(app, path)

		let { processOptions, proxyOptions, registryOptions, manifestOptions, clusterOptions, logOptions } = this.options

		let p = { app, service: 'p', provider: ProcessService, serviceOptions: processOptions || { disableStringify: true }}
		let proxy = { app, service: 'proxy', provider: ProxyService, serviceOptions: proxyOptions || { disableStringify: true }}
		let registry = { app, service: 'registry', provider: RegistryService, serviceOptions: registryOptions || { disableStringify: true }}
		let manifest = { app, service: 'manifest', provider: ManifestService, serviceOptions: manifestOptions || { disableStringify: true }}
		let cluster = { app, service: 'cluster', provider: ClusterService, serviceOptions: clusterOptions || { disableStringify: true }}
		let log = { app, service: 'log', provider: LogService, serviceOptions: logOptions || { disableStringify: true }}
		let services = [p, proxy, registry, manifest, cluster, log]
		
		await this.addService(services).then((services: any) => {
			this.p = app.service('p')
			this.proxy = app.service('proxy')
			this.registry = app.service('registry')
			this.manifest = app.service('manifest')
			this.cluster = app.service('cluster')
			this.log = app.service('log')
		})
	}
	protected setCpus (options: ManagerOptions): any {
		this.cpus = cpus().length
		this.buildCount = options.buildCount || 1
		this.proxyCount = options.proxyCount || 1
		this.totalCount = this.proxyCount + this.buildCount

		if (this.buildCount === 0) {
			throw new Error('manager service build count must be greater than zero.')
		}
		if (this.proxyCount === 0) {
			throw new Error('manager service proxy count must be greater than zero.')
		}
		if (this.cpus < this.totalCount) {
			throw new Error('manager service cpu allocation must be less than or equal to available system cpus.')
		}
	}

	protected async createImplementation (store: any, storeIsService: boolean, data: any, params?: any): Promise<any> {
		this.validateCreate(data)
		let id = data[this.id] || this.generateId()
		let tmp = directory()
		let registered = await this.registry.create({ spec: data.spec })
		let { spec } = registered.v1
		let appId = id
		let registry = spec.id
		let status = { generated: false, packaged: false, cached: false, running: false }
		let cores = 0
		let url = ''
		let entry = await this.manifest.create({ id, appId, registry, directory: tmp, cores, url, status })
		let tasks: any = []
		if (data.hydrate) {
			return this.hydrate(id, spec, tmp, entry)
		}
		if (data.generate) {
			tasks = [this.writeSpec(spec, tmp), this.generate(id, tmp, entry)]
			if (data.package) {
				tasks = [...tasks, this.package(id, tmp, entry)]
				if (data.run) {
					tasks = [...tasks, this.run(id, tmp, entry)]
				}
			}
			if (data.run) {
				tasks = [...tasks, this.run(id, tmp, entry)]
			}
		}
		return series(tasks)
	}

	protected validateCreate (data: any): any {
		if (!data.spec) {
			throw new Error('spec required to create application.')
		}
	}

	protected async patchImplementation (store: any, storeIsService: boolean, id: any, data: any, params?: any): Promise<any> {
		return super.patchImplementation(store, storeIsService, data, params)
	}

	protected validatePatch (data: any): any {}

	protected async updateImplementation (store: any, storeIsService: boolean, id: any, data: any, params?: any): Promise<any> {
		return super.patchImplementation(store, storeIsService, data, params)
	}

	protected validateUpdate (data: any): any {}

	protected async removeImplementation (store: any, storeIsService: boolean, id: any, params?: any): Promise<any> {
		return super.removeImplementation(store, storeIsService, id, params)
	}

	protected async hydrate (id: any, spec: any, tmp: any, code?: any, entry?: any): Promise<any> {
		return series([
			() => this.writeSpec(spec, tmp),
			() => this.writeCodeList(code, tmp),
			() => this.generate(id, tmp, entry),
			() => this.package(id, tmp, entry),
			() => this.run(id, tmp, entry)
		])
	}

	protected async updateStatus (id: any, category: any, s: any, entry?: any): Promise<any> {
		if (!entry) {
			let entry = await this.manifest.get(id)
		}
		let status = { ...entry.status, [category]: s }
		entry = { ...entry, status }
		return this.manifest.patch(id, entry)
	}

	protected async writeSpec (spec: any, cwd: any): Promise<any> {
		return writeJson(`${cwd}/feathers-gen-specs.json`, spec)
	}

	protected async writeCodeList (codeList: any, cwd: any): Promise<any> {
		let { id, cp } = this.p.create({command: 'feathers-plus', args: ['generate', 'codelist'] })
		let { stdout } = await cp
		return fs.outputFileAsync(`${cwd}/feathers-gen-code.js`, stdout)
	}

	protected async addPkgOptions (dir: any): Promise<any> {
		let dist = `${dir}/dist`
		let bin = `./${dist}/index.js`
		let scripts = `${dist}/*.js`
		let assets = `${dist}/public/**/*`
		let pkg = { scripts, assets }
		return readJson(`${dir}/package.json`).then((json: any) => {
			let updated = { ...json, bin, pkg }
			return writeJson(`"${dir}/package.json"`, updated)
		})
	}

	protected async generate (id: any, tmp: any, entry?: any): Promise<any> {
		if (!entry) {
			let entry = await this.manifest.get(id)
		}
		let { stdout, stderr } = this.p.create({command: 'yarn yes | feathers-plus', args: ['generate', 'app'] })
		return this.updateStatus(id, 'generated', true, entry)
	}

	protected async package (id: any, tmp: any, entry?: any, targets?: string): Promise<any> {
		if (!entry) {
			let entry = await this.manifest.get(id)
		}
		await this.addPkgOptions(tmp)
		let { stdout, stderr } = this.p.create({command: 'yarn pkg', args: [`.`, '--targets', targets || this.defaultPkgTargets], options: { cwd: tmp }})
		return this.updateStatus(id, 'packaged', true, entry)
	}

	protected async run (id: any, dir: any, entry?: any, target?: any): Promise<any> {
		if (!entry) {
			let entry = await this.manifest.get(id)
		}
		let t = target || 'linux'
		let { packaged } = entry.status
		let { workers } = await this.cluster.create({
			settings: {
				exec: packaged ? `yarn ${dir}/${id}-${t}` : `yarn ${dir}/dist/index.js`
			}
		})
		workers.forEach((worker: any) => {
			this.setWorkerLog(id, worker)
		})
		return this.updateStatus(id, 'running', true, entry)
	}

	protected async setWorkerLog (appId: any, worker: any): Promise<any> {
		let service = 'cluster-service'
		let type, message
		worker.on('online', () => {
			type = 'online'
			message = `worker ${worker.process.pid} is online`
			this.log.create({ appId, service, type, message })
		})
		worker.on('disconnect', () => {
			type = 'disconnect'
			message = `worker ${worker.process.pid} disconnected`
			this.log.create({ appId, service, type, message })
		})
		worker.on('listening', (a: any) => {
			type = `wm-${worker.process.pid}`
			message = `listening at ${a}`
			this.log.create({ appId, service, type, message })
		})
		worker.on('message', (m: any, h: any) => {
			type = `wm-${worker.process.pid}`
			message = m
			this.log.create({ appId, service, type, message })
		})
		worker.on('exit', () => {
			type = 'exit'
			message = `worker ${worker.process.pid} exit`
			this.log.create({ appId, service, type, message })
		})
		worker.on('error', (e: any) => {
			type = `wm-${worker.process.pid}`
			message = e.message
			this.log.create({ appId, service, type, message })
		})
	}
}
