import { _select } from '@feathers-service-manager/utils'

import { ServiceClass as BaseServiceClass } from '@feathers-service-manager/base-service'

import { default as Debug } from 'debug'

const debug = Debug('@feathers-service-manager:registry-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
		debug('registry-service initialized')
	}
	public async createImplementation (store: any, data: any, params?: any): Promise<any> {
		this.verifyCreate(data)
		let version = data.version || 'v1'
		let code = data.code || ''
		let spec = data.spec
		return super.createImplementation(store, { [version]: { code, spec }}, params)
	}
	public verifyCreate (data: any): any {
		if (!data.spec) {
			throw new Error('registery service requires application spec.')
		}
	}
}
