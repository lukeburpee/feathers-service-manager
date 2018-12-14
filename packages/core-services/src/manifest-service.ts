import { _select } from '@feathers-service-manager/utils'

import { ServiceClass as BaseServiceClass } from './base-service'

import { default as Debug } from 'debug'

const debug = Debug('feathers-service-manager:core-services:manifest-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
		debug('manifest-service initialized')
	}
	public async createImplementation (store: any, data: any, params?: any): Promise<any> {
		if (!data.appId) {
			throw new Error('manifest service requires an app identifier.')
		}
		let appId = data.appId
		return super.createImplementation(store, { appId }, params)
	}
}
