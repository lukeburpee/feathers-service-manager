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
		this.validateOptions(options)
		debug('job-service initialized')
	}
	public validateOptions (options: JobOptions): any {
		if (!options.registry) {
			throw new Error('job service requires registry.')
		}
		if (!options.taskRegistry) {
			throw new Error('job service requires task registry.')
		}
		this.registry = options.jobRegistry
		this.taskRegistry = options.taskRegistry
	}
	public async setup (app: any, path: any): Promise<any> {
		super.setup(app, path)
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
}
