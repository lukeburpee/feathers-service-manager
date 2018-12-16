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
		this.verifyCreate(data)
		let { app, cores, health } = data
		return super.createImplementation(store, { app, cores }, params)
	}
	public verifyCreate (data: any): any {
		if (!data.app) {
			throw new Error('manifest service requires an app identifier.')
		}
		if (!data.cores) {
			throw new Error('manifest service requires core count.')
		}
		if (!data.health) {
			throw new Error('manifest service requires app health.')
		}
	}
}
