import { Id, Params } from '@feathersjs/feathers'
import { NotFound } from '@feathersjs/errors'
import { filterQuery, sorter, _ } from '@feathersjs/commons'
import { _select } from '@feathers-service-manager/utils'
import { ServiceClass as BaseServiceClass } from './base-service'
import { generate } from 'selfsigned'

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {

	private defaultSettings?: any;

	constructor (options: ServiceOptions) {
		super(options)
		this.defaultSettings = { days: 365 }

	}
	public async generateCertificate (data?: any): Promise<any> {
		return new Promise((resolve, reject) => {
			let attributes = data.attributes || null
			let settings = data.settings || this.defaultSettings

			generate(attributes, settings, (err: any, pems: any) => {
				if (err) {
					return reject(err)
				}
				return resolve(pems)
			})
		})
	}
	public createImplementation (store: any, data: any, params?: Params): any {
		let id = data[this.id] || this.generateId();
		this.generateCertificate(data)
			.then((pems: any) => {
				const current = _.extend({}, pems, { [this.id]: id });
				return Promise.resolve((store[id] = current))
					.then(_select(params, this.id));
			})
	}
}
