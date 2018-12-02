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
	public createImplementation (store: any, data: any, params?: Params): any {
		let id = data[this.id] || this.generateId();
		let current = _.extend({}, data, { [this.id]: id });

		return Promise.resolve((store[id] = current))
			.then(_select(params, this.id));
	}
}
