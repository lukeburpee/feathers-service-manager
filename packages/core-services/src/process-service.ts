import { default as Debug } from 'debug'
import execa from 'execa'

import { ServiceClass as BaseServiceClass } from './base-service'

const debug = Debug('feathers-service-manager:core-services:process-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor(options: ServiceOptions) {
		super(options)
	}
	public async createImplementation (store: any, data: any, params?: any): Promise<any> {
		if (!data.command) {
			throw new Error('execute process requires a command.')
		}
		let cp = execa(data.command, data.args || [], data.options || [])
		return super.createImplementation(store, { cp }, params)
	}

	public async removeImplementation (store: any, id: any, params?: any): Promise<any> {
		if (id in store) {
			let cp = store[id].cp
			cp.kill()
			return super.removeImplementation(store, id, params)
		}
		return this.throwNotFound(id)
	}
}