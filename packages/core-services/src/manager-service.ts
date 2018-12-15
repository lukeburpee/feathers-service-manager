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
		if (!data.spec) {
			throw new Error('spec required to create application.')
		}

		return super.createImplementation(store, data, params)
	}

	private async register (spec: any): Promise<any> {
		return this.registry.create({ spec })
	}

	private async hydrate (id: any): Promise<any> {
		let tmp = directory()
		let spec = this.registry.get(id)
		let write = this.writeSpec(spec, tmp)
		let generate = this.generate(tmp)
		return series([tmp, spec, write, generate])
	}

	private async writeSpec (spec: any, cwd: any): Promise<any> {
		return writeJson(`${cwd}/feathers-gen-specs.json`, spec)
	}

	private async generate (tmp: any): Promise<any> {
		return this.p.create({command: 'yes | feathers-plus', args: ['generate', 'app'] })
	}

	private async compress (cwd: any): Promise<any> {
		return this.p.create({command: 'ncc', args: ['build', 'src/index.js', '-o', 'dist'], options: { cwd }})
	}

	private async package (cwd: any): Promise<any> {
		return this.p.create({command: 'pkg', options: { cwd }})
	}
}
