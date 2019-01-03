import { Id, Params } from '@feathersjs/feathers'
import { _ } from '@feathersjs/commons'
import { _select } from '@feathers-service-manager/utils'
import { generate } from 'selfsigned'
import { default as Debug } from 'debug'
import { ServiceClass as BaseServiceClass } from '@feathers-service-manager/base-service'

const debug = Debug('feathers-service-manager:core-services:certificate-service')

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {

	private defaultSettings?: any;

	constructor (options: ServiceOptions);
	constructor (options: CertificateOptions) {
		super(options)
		this.defaultSettings = options.defaultSettings || { days: 365 }
		debug('certificate-service initialized')
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
				if (formatterKeys.includes(key)) {
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
		let attributes = this.validateCertAttributes(data.attributes)
		let settings = data.settings || this.defaultSettings
		return new Promise((resolve, reject) => {
			return generate (attributes, settings, (err: any, pems: any) => {
					if (err) {
						return reject(err)
					}
					return resolve(pems)
				}
			)
		})
	}

	public throwPemChangeError (id: any): any {
		throw new Error(`certificate-service update error: certificate ${id} pem cannot be changed directly.`)
	}

	public async createImplementation (store: any, data: any, params?: Params): Promise<any> {
		let id = data[this.id] || this.generateId();
		let pems = await this.generateCertificate(data)
		const current = _.extend({},
			{ [this.id]: id },
			{ attributes: data.attributes || null },
			{ settings: data.settings || null },
			pems
		)
		return Promise.resolve((store[id] = current))
			.then(_select(params, this.id))
	}

	public updateImplementation (store: any, id: Id, data: any, params?: Params): any {
		if (id in store) {
			if (data.private || data.public || data.cert) {
				this.throwPemChangeError(id)
			}
			const updateData = _.extend({}, data, { [this.id]: id })
			return this.createImplementation(store, updateData, params)
		}
		return this.throwNotFound(id)
	}

	public patchImplementation (store: any, id: Id, data: any, params?: Params): any {
		if (id in store) {
			if (data.private || data.public || data.cert) {
				this.throwPemChangeError(id)
			}
			if (data.regenerate) {
				debug(`regenerating pem for ${id}`)
				return this.createImplementation(store, store[id], params)
			}
			const patchData = _.extend({}, store[id], _.omit(data, this.id))
			return this.createImplementation(store, patchData, params)
		}
		return this.throwNotFound(id)
	}
}
