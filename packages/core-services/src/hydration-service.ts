import { default as Debug } from 'debug'

import { ServiceClass as ProcessServiceClass } from './process-service'

const debug = Debug('feathers-service-manager:core-services:hydration-service')

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends ProcessServiceClass {
	constructor(options: ServiceOptions) {
		super(options)
	}
}