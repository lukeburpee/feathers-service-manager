import { ServiceClass as MultiServiceClass } from '@feathers-service-manager/multi-service'
import ClusterService from '@feathers-service-manager/cluster-service'
import ProcessService from '@feathers-service-manager/process-service'

import { default as Debug } from 'debug'

const debug = Debug('feathers-service-manager:task-service')

export default function init (options: TaskOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends MultiServiceClass {
	public registry!: any;
	public p!: any;
	public c!: any;
	constructor (options: TaskOptions) {
		super(options)
		this.setOptions(options)
		debug('task-service initialized')
	}
	public setOptions (options: TaskOptions): any {
		if (!options.registry) {
			throw new Error('task service requires task registry.')
		}
		this.registry = options.registry
	}
	public async setup (app: any, path: any): Promise<any> {
		super.setup(app, path)
		let p = await this.addService({
			app,
			service: 'p',
			provider: ProcessService,
			serviceOptions: {
				disableStringify: true
			}
		})
		let c = await this.addService({
			app,
			service: 'c',
			provider: ClusterService,
			serviceOptions: {
				disableStringify: true
			}
		})
		this.p = p.service
		this.c = c.service
	}
}
