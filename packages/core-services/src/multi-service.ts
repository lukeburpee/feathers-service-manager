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

	public async addService (data: any): Promise<any> {
		let serviceApp = data.app || this.app
		delete data.app
		let id = data[this.services._id] || this.generateId()
		let service = this.serviceCheck(serviceApp, data)
		service = await this.services.create({
			[this.services._id]: id,
			service
		})
		return service
	}

	public getService (id: any, params?: any): any {
		return this.services.get(id, params)
	}
	public findService (params?: any): any {
		return this.services.find(params)
	}

	public removeService (id: any, params?: any): any {
		return this.services.remove(id, params)
	}

	public serviceCheck (app: any, data: any): any {
		if (typeof data.service === 'string') {
			if (typeof app.service(data.service) === 'undefined') {
				debug(`no service ${data.service} found on application setup. ${data.service} will be created`)
				let provider = data.provider || BaseService
				let serviceOptions = data.serviceOptions || { id: 'id', disableStringify: true }
				app.use(data.service, provider(serviceOptions))
				return app.service(data.service)
			}
			return app.service(data.service)
		}
		return data.service
	}

	private multiCheck (app: any): any {
		if (this.options.multiOptions) {
			this.services = this.serviceCheck(app, this.options.multiOptions)
			return this.services
		}
		this.services = this.serviceCheck(app, { service: 'multi-services', serviceOptions: { id: 'serviceId', disableStringify: true }})
		return this.services
	}
}