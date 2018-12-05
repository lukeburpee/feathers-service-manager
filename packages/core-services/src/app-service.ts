import { ServiceClass as ConnectionServiceClass } from './connection-service'
import { default as Debug } from 'debug'

const debug = Debug('feathers-service-manager:core-services:app-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends ConnectionServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
		debug('app-service initialized')
	}
}
