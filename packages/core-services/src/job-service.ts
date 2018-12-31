import { ServiceClass as BaseServiceClass } from './base-service'

import { default as Debug } from 'debug'

const debug = Debug('feathers-service-manager:core-services:job-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
		debug('job-service initialized')
	}
}
