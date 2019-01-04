import { ServiceClass as MultiServiceClass } from '@feathers-service-manager/multi-service'
import TaskService from './task-service'

import { default as Debug } from 'debug'

const debug = Debug('feathers-service-manager:job-service')

export default function init (options: JobOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends MultiServiceClass {
	public registry!: any;
	public tasks!: any;
	public taskRegistry!: any;
	constructor (options: MultiOptions);
	constructor (options: JobOptions) {
		super(options)
		debug('job-service initialized')
	}
	public async setup (app: any, path: any): Promise<any> {
		super.setup(app, path)
		this.registryCheck()
		let tasks = await this.addService({ 
			app, 
			service: 'tasks',
			provider: TaskService,
			serviceOptions: {
				registry: this.taskRegistry,
				disableStringify: true
			}
		})
		this.tasks = tasks.service
	}
	private registryCheck (): any {
		if (!this.options.registry) {
			throw new Error('job service requires registry.')
		}
		if (!this.options.taskRegistry) {
			throw new Error('job service requires task registry.')
		}
		this.registry = this.options.registry
		this.taskRegistry = this.options.taskRegistry
	}
}
