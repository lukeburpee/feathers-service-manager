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

	public validateCertAttributes (attr?: any): any {
		if (attr) {
			const attributes: any = {
				name: 'commonName',
				country: 'countryName',
				locality: 'localityName',
				state: 'stateOrProviceName',
				organization: 'organizationName',
				orgUnit: 'organizationalUnitName'
			}
			const formatterKeys = Object.keys(attributes)
			const validationKeys = Object.keys(attr)
			const output = validationKeys.map((key: any) => {
				if(formatterKeys.includes(key)) {
					return {
						name: attributes[key],
						value: attr[key]
					}
				}
				throw new Error(`certificate-service error: Invalid certificate attribute ${key}`)
			})
			return output
		}
		return null
	}

	public async generateCertificate (data?: any): Promise<any> {
		return new Promise((resolve, reject) => {
			return generate (this.validateCertAttributes(data.attributes), data.settings || this.defaultSettings, (err: any, pems: any) => {
				if (err) {
					return reject(err)
				}
				return resolve(pems)
			})
		})
	}
	public createImplementation (store: any, data: any, params?: Params): Promise<any> {
		let id = data[this.id] || this.generateId();
		return this.generateCertificate(data)
			.then((pems: any) => {
				const current = _.extend({}, pems, { [this.id]: id });
				return Promise.resolve((store[id] = current))
					.then(_select(params, this.id));
			})
	}
}
