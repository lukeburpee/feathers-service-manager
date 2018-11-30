import { Id } from '@feathersjs/feathers'
import { BaseServiceClass } from '@feathers-service-manager/base-service'

export default function init (options: ServiceOptions) {
  return new Service(options)
}

export class Service extends BaseServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
	}
}
