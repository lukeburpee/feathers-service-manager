import { default as Debug } from 'debug'

import { ServiceClass as BaseServiceClass } from './base-service'

const debug = Debug('feathers-service-manager:core-services:cluster-service')

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor(options: ServiceOptions) {
		super(options)
	}
	
}