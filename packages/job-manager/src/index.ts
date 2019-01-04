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
	private async registerDefaultJobs (): Promise<any> {}
	private async registerDefaultTasks (): Promise<any> {
		let tasks = [{
			action: 'copy',
			command: 'cpy'
		}]
	}
	private async registerTask (spec: any): Promise<any> {
		return this.taskRegistry.create(spec)
	}
	private async registerJob (spec: any): Promise<any> {
		return this.jobRegistry.create(spec)
	}
	private async queueJob (id: any): Promise<any> {}
	private async setJobPriority (id: any, priority: any): Promise<any> {}
	private async cancelJob (id: any): Promise<any> {}
	private async pauseJob (id: any): Promise<any> {}
	private async runJob (id: any): Promise<any> {}
	public async createImplementation(store: any, data: any, params?: any): Promise<any> {}
}
