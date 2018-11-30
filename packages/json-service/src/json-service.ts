import { Id } from '@feathersjs/feathers'
import { NotFound } from '@feathersjs/errors'
import { BaseServiceClass } from '@feathers-service-manager/base-service'

export default function init (options: ServiceOptions) {
  return new Service(options)
}

export class Service extends BaseServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
	}
	public throwNotFound (id: Id): NotFound {
    	throw new NotFound(`No record found for id '${id}'`)
	}
}
