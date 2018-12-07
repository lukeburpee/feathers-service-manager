import { ServiceClass as BaseServiceClass } from './base-service'
import { default as Debug } from 'debug'

const debug = Debug('feathers-service-manager:core-services:proxy-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
	}
	public setup(app: any, path: any): any {
		super.setup(app, path)
	}
}
