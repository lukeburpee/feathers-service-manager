import { _select } from '@feathers-service-manager/utils'

import { default as Debug } from 'debug'

import { ServiceClass as BaseServiceClass } from '@feathers-service-manager/base-service'

const debug = Debug('feathers-service-manager:core-services:log-service')

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor(options: ServiceOptions) {
		super(options)
	}
	protected async createImplementation (store: any, storeIsService: boolean, data: any, params?: any): Promise<any> {
		this.validateCreate(data)
		return super.createImplementation(store, storeIsService, data, params)
	}
	private validateCreate (data: any): any {
		if (!data.appId) {
			throw new Error('log requires appId.')
		}
		if (!data.service) {
			throw new Error('log requires service.')
		}
		if (!data.type) {
			throw new Error('log requires type.')
		}
		if (!data.status) {
			throw new Error('log requires status.')
		}
		if (!data.message) {
			throw new Error('log requires message.')
		}
	}
}