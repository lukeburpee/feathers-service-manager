import { directory, file } from 'tempy'
import writeJson from 'write-json-file'
import series from 'p-series'
import { cpus } from 'os'

import { default as Debug } from 'debug'

import { ServiceClass as MultiServiceClass } from './multi-service'

import ProcessService from './process-service'
import ClusterService from './cluster-service'

import ProxyService from './proxy-service'
import ManifestService from './manifest-service'

import RegistryService from './registry-service'
import LogService from './log-service'

const debug = Debug('feathers-service-manager:core-services:manager-service')

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
	constructor(options: ServiceOptions) {
		super(options)
		this.cpus = cpus()
	}
	public async setup (app: any, path: any): Promise<any> {
		await super.setup(app, path)

		let { 
			processOptions, 
			proxyOptions, 
			registryOptions, 
			manifestOptions, 
			clusterOptions, 
			logOptions 
		} = this.options

		await this.addService([{
			app,
			service: 'p',
			serviceOptions: processOptions || {
				provider: ProcessService,
				disableStringify: true
			}
		}, {
			app,
			service: 'proxy',
			serviceOptions: proxyOptions || {
				provider: ProxyService,
				disableStringify: true
			}
		}, {
			app,
			service: 'registry',
			serviceOptions: registryOptions || {
				provider: RegistryService,
				disableStringify: true
			}
		}, {
			app,
			service: 'manifest',
			serviceOptions: manifestOptions || {
				provider: ManifestService,
				disableStringify: true
			}
		}, {
			app,
			service: 'cluster',
			serviceOptions: clusterOptions || {
				disableStringify: true
			}
		}, {
			app,
			service: 'log',
			serviceOptions: logOptions || {
				provider: LogService,
				disableStringify: true
			}
		}]).then((services: any) => {
			this.p = app.service('p')
			this.proxy = app.service('proxy')
			this.registry = app.service('registry')
			this.manifest = app.service('manifest')
			this.cluster = app.service('cluster')
			this.log = app.service('log')
		})
	}
	public async createImplementation (store: any, data: any, params?: any): Promise<any> {
		this.verifyCreate(data)
		let id = data[this.id] || this.generateId()
		let tmp = directory()
		let registered = await this.registry.create({ spec: data.spec })
		let { spec } = registered
		let entry = await this.manifest.create({
			id,
			app: id,
			registry: spec.id,
			directory: tmp,
			cores: 0,
			url: '',
			status: {
				generated: false,
				compressed: false,
				packaged: false,
				cached: false,
				running: false
			}
		})
		let tasks: any = []
		if (data.hydrate) {
			return this.hydrate(id, spec, tmp, entry)
		}
		if (data.generate) {
			tasks = [this.writeSpec(spec, tmp), this.generate(id, tmp, entry)]
			if (data.compress) {
				tasks = [...tasks, this.compress(id, tmp, entry)]
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
			if (data.run) {
				tasks = [...tasks, this.run(id, tmp, entry)]
			}
		}
		return series(tasks)
	}

	public async patchImplementation (store: any, id: any, data: any, params?: any): Promise<any> {
		return super.patchImplementation(store, data, params)
	}

	public async removeImplementation (store: any, id: any, params?: any): Promise<any> {
		return super.removeImplementation(store, id, params)
	}

	public verifyCreate (data: any): any {
		if (!data.spec) {
			throw new Error('spec required to create application.')
		}
	}

	private async register (spec: any): Promise<any> {
		return this.registry.create({ spec })
	}

	private async hydrate (id: any, spec: any, tmp: any, entry?: any): Promise<any> {
		let write = this.writeSpec(spec, tmp)
		let generate = this.generate(id, tmp, entry)
		let compress = this.compress(id, tmp, entry)
		let pkg = this.package(id, tmp, entry)
		let run = this.run(id, tmp, entry)
		return series([write, generate, pkg, run])
	}

	private async updateStatus (id: any, category: any, status: any, entry?: any): Promise<any> {
		if (!entry) {
			let entry = await this.manifest.get(id)
		}
		entry = { ...entry, status: { ...entry.status, [category]: status }}
		return this.manifest.patch(id, entry)
	}

	private async writeSpec (spec: any, cwd: any): Promise<any> {
		return writeJson(`${cwd}/feathers-gen-specs.json`, spec)
	}

	private async generate (id: any, tmp: any, entry?: any): Promise<any> {
		if (!entry) {
			let entry = await this.manifest.get(id)
		}
		let { stdout, stderr } = this.p.create({command: 'yarn yes | feathers-plus', args: ['generate', 'app'] })
		return this.updateStatus(id, 'generated', true, entry)
	}

	private async compress (id: any, tmp: any, entry?: any): Promise<any> {
		if (!entry) {
			let entry = await this.manifest.get(id)
		}
		let { stdout, stderr } = this.p.create({command: 'yarn ncc', args: ['build', '${cwd}/src/index.ts', '-o', 'dist'], options: { cwd: tmp }})
		return this.updateStatus(id, 'compressed', true, entry)
	}

	private async package (id: any, tmp: any, entry?: any): Promise<any> {
		if (!entry) {
			let entry = await this.manifest.get(id)
		}
		let { stdout, stderr } = this.p.create({command: 'yarn pkg', options: { cwd: tmp }})
		return this.updateStatus(id, 'packaged', true, entry)
	}

	private async run (id: any, tmp: any, entry?: any): Promise<any> {
		if (!entry) {
			let entry = await this.manifest.get(id)
		}
		let cluster = await this.cluster.create({
			settings: {
				exec: entry.status.compressed ? `yarn ncc` : `node`,
				args: [
					entry.status.compressed ? 'run ${tmp}/dist/index.js' : '${tmp}/src/index.js'
				]
			}})
		return this.updateStatus(id, 'running', true, entry)
	}
}
