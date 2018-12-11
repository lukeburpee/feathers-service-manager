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
		this.multiCheck(app)
	}

	public addService (id: any, data: any, app?: any): any {
		return this.serviceCheck(app ? app : this.app, data.service, data.options)
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

	public serviceCheck (app: any, service: any, options?: any): any {
		return new Promise(resolve => {
			if (typeof service === 'string') {
				if (typeof app.service(service) === 'undefined') {
					debug(`no service ${service} found on application setup. ${service} will be created`)
					let provider = options.provider ? options.provider : BaseService
					let serviceOptions = options.serviceOptions ? options.serviceOptions : { id: 'id' }
					app.use(service, provider(serviceOptions))
				}
				return resolve(app.service(service))
			}
			return resolve(service)
		})
	}

	protected multiCheck (app: any): any {
		return new Promise(resolve => {
			if (this.options.multi) {
				return this.serviceCheck(app, this.options.multi, this.options.multiOptions || null)
					.then((service: any) => {
						this.services = service
						Promise.resolve(this.services)
					})
			}
			return this.serviceCheck(app, 'services', { serviceOptions: { id: 'serviceId' }})
				.then((service: any) => {
					this.services = service
					Promise.resolve(this.services)
				})
		})
	}
}