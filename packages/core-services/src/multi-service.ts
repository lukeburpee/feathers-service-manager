import { default as Debug } from 'debug'

import BaseService, { ServiceClass as BaseServiceClass } from './base-service'

const debug = Debug('feathers-service-manager:core-services:multi-service')

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	public services!: any
	constructor(options: ServiceOptions) {
		super(options)
	}

	public setup(app: any, path: any): any {
		super.setup(app, path)
		return this.multiCheck(app)
	}

	public addService (data: any): any {
		let serviceApp = data.app || this.app
		delete data.app
		let id = data[this.services._id] || this.generateId()
		return this.serviceCheck(serviceApp, data)
			.then((service: any) => {
				return this.services.create({
					[this.services._id]: id,
					service
				})
			})
	}

	public getService (id: any, params?: any): any {
		return this.services.get(id, params)
	}
	public findService (params?: any): any {
		return this.services.find(params || {})
	}

	public removeService (id: any, params?: any): any {
		return this.services.remove(id, params)
	}

	public serviceCheck (app: any, data: any): any {
		return new Promise(resolve => {
			if (typeof data.service === 'string') {
				if (typeof app.service(data.service) === 'undefined') {
					debug(`no service ${data.service} found on application setup. ${data.service} will be created`)
					let provider = data.provider || BaseService
					let serviceOptions = data.serviceOptions || { id: 'id', disableStringify: true }
					app.use(data.service, provider(serviceOptions))
					return resolve(app.service(data.service))
				}
				return resolve(app.service(data.service))
			}
			return resolve(data.service)
		})
	}

	private multiCheck (app: any): any {
		return new Promise(resolve => {
			if (this.options.multiOptions) {
				return this.serviceCheck(app, this.options.multiOptions)
					.then((service: any) => {
						this.services = service
						return Promise.resolve(this.services)
					})
			}
			return this.serviceCheck(app, { service: 'multi-services', serviceOptions: { id: 'serviceId', disableStringify: true }})
				.then((service: any) => {
					this.services = service
					return Promise.resolve(this.services)
				})
		})
	}
}