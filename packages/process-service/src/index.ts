import { default as Debug } from 'debug'
import execa from 'execa'
import pidusage from 'pidusage'

import { ServiceClass as BaseServiceClass } from '@feathers-service-manager/base-service'

const debug = Debug('feathers-service-manager:process-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor(options: ServiceOptions) {
		super(options)
	}
	public async createImplementation (store: any, storeIsService: boolean, data: any, params?: any): Promise<any> {
		if (!data.command) {
			throw new Error('execute process requires a command.')
		}
		let cp = execa(data.command, data.args || [], data.options || [])
		return super.createImplementation(store, storeIsService, { cp }, params)
	}

	public async removeImplementation (store: any, storeIsService: boolean, id: any, params?: any): Promise<any> {
		if (id in store) {
			let cp = store[id].cp
			cp.kill()
			return super.removeImplementation(store, storeIsService, id, params)
		}
		return this.throwNotFound(id)
	}
}