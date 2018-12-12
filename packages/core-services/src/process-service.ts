import { default as Debug } from 'debug'
import execa from 'execa'

import { ServiceClass as MultiServiceClass } from './multi-service'

const debug = Debug('feathers-service-manager:core-services:process-service')

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends MultiServiceClass {
	public processId!: any;
	public processes!: any;
	constructor(options: ServiceOptions) {
		super(options)
		this.processId = options.processId || 'processId'
	}
	public async setup (app: any, path: any): Promise<any> {
		super.setup(app, path)
		await this.addService({
			app,
			service: 'processes',
			serviceOptions: {
				id: this.processId
			}
		}).then((processes: any) => {
			this.processes = processes.service
		})
	}

	public async execute (data: any): Promise<any> {
		if (!data.command) {
			throw new Error('execute process requires a command.')
		}
		let p = execa(data.command, data.args || [], data.options || [])
		return Promise.resolve(await this.processes.create({
			[this.processId]: data.id || p.pid,
			...p
		}))
	}

	public async kill (id: any): Promise<any> {
		let { pid } = await this.processes.get(id)
		process.kill(pid, 'SIGINT')
		return Promise.resolve(await this.processes.remove(id))
	}
}