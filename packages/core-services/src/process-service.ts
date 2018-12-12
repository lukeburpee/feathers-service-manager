import { default as Debug } from 'debug'
import execa from 'execa'

import { ServiceClass as MultiServiceClass } from './multi-service'

const debug = Debug('feathers-service-manager:core-services:process-service')

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends MultiServiceClass {
	public processId!: string;
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
				id: this.processId,
				disableStringify: true
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
		let stored = await this.processes.create({
			[this.processId]: data[this.processId] || p.pid,
			cp: p
		})
		return stored
	}

	public async kill (id: any): Promise<any> {
		let { cp } = await this.processes.get(id)
		cp.kill()
		let removed = await this.processes.remove(id)
		return removed
	}
}