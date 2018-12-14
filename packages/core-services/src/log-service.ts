import { _select } from '@feathers-service-manager/utils'

import { default as Debug } from 'debug'

import { ServiceClass as BaseServiceClass } from './base-service'

const debug = Debug('feathers-service-manager:core-services:log-service')

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor(options: ServiceOptions) {
		super(options)
	}
	public async createImplementation (store: any, data: any, params?: any): Promise<any> {
		return super.createImplementation(store, data, params)
	}
}