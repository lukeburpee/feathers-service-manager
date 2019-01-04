import { ServiceClass as MultiServiceClass } from '@feathers-service-manager/multi-service'
import RegistryService from '@feathers-service-manager/registry-service'

import JobService from './job-service'

import { default as Debug } from 'debug'

const debug = Debug('feathers-service-manager:job-manager')

export default function init (options: MultiOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends MultiServiceClass {
	public jobs!: any;
	public taskRegistry!: any;
	public jobRegistry!: any;
	constructor (options: MultiOptions) {
		super(options)
		debug('job-manager initialized')
	}
	public async setup (app: any, path: any): Promise<any> {
		super.setup(app, path)
		let jobRegistry = await this.addService({
			app,
			service: 'job-registry',
			provider: RegistryService,
			serviceOptions: {
				registryType: 'job',
				specKeys: ['name', 'tasks', 'priority'],
				disableStringify: true
			}
		})
		let taskRegistry = await this.addService({
			app,
			service: 'task-registry',
			provider: RegistryService,
			serviceOptions: {
				registryType: 'task',
				specKeys: ['action', 'command', 'src', 'target', 'workers'],
			}
		})
		let jobs = await this.addService({ 
			app, 
			service: 'jobs', 
			provider: JobService,
			serviceOptions: {
				registry: jobRegistry.service,
				taskRegistry: taskRegistry.service,
				disableStringify: true
			}
		})
		this.jobs = jobs.service
		this.jobRegistry = jobRegistry.service
		this.taskRegistry = taskRegistry.service
	}
	protected async registerDefaultJobs (): Promise<any> {}
	protected async registerDefaultTasks (): Promise<any> {
		let tasks = [{
			action: 'copy',
			command: 'cpy'
		}]
	}
	protected async registerTask (spec: any): Promise<any> {
		return this.taskRegistry.create(spec)
	}
	protected async registerJob (spec: any): Promise<any> {
		return this.jobRegistry.create(spec)
	}
	protected async queueJob (id: any): Promise<any> {}
	protected async setJobPriority (id: any, priority: any): Promise<any> {}
	protected async cancelJob (id: any): Promise<any> {}
	protected async pauseJob (id: any): Promise<any> {}
	protected async runJob (id: any): Promise<any> {}
	protected async createImplementation(store: any, data: any, params?: any): Promise<any> {}
}
