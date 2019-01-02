import { ServiceClass as BaseServiceClass } from '@feathers-service-manager/base-service'

import { default as Debug } from 'debug'

const debug = Debug('feathers-service-manager:task-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
		debug('task-service initialized')
	}
}
