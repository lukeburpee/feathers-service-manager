import { _select } from '@feathers-service-manager/utils'

import { ServiceClass as BaseServiceClass } from '@feathers-service-manager/base-service'

import { default as Debug } from 'debug'

const debug = Debug('feathers-service-manager:manifest-service')

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
		return super.createImplementation(store, data, params)
	}

	public async patchImplementation (store: any, id: any, data: any, params?: any): Promise<any> {
		let { appId, registry, cores, url, status } = data
		return super.patchImplementation(store, id, data, params)
	}

	public async removeImplementation (store: any, id: any, params?: any): Promise<any> {
		return super.removeImplementation(store, id, params)
	}
	
	public verifyCreate (data: any): any {
		if (!data.appId) {
			throw new Error('manifest service requires an appId.')
		}
		if (!data.cores) {
			throw new Error('manifest service requires core count.')
		}
		if (!data.status) {
			throw new Error('manifest service requires app status.')
		}
	}
}