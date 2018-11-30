import { Id } from '@feathersjs/feathers'
import { NotFound } from '@feathersjs/errors'
import { ServiceClass as BaseServiceClass } from './base-service'

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
	}
	public throwNotFound (id: Id): NotFound {
    	throw new NotFound(`No record found for id '${id}'`)
	}
}
