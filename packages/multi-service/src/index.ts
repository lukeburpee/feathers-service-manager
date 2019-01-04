import { default as Debug } from 'debug'

import BaseService, { ServiceClass as BaseServiceClass } from '@feathers-service-manager/base-service'

const debug = Debug('feathers-service-manager:multi-service')

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	public services!: any
	constructor(options: MultiOptions) {
		super(options)
	}

	public setup(app: any, path: any): any {
		super.setup(app, path)
		this.multiCheck(app)
	}

	protected async addService (data: any): Promise<any> {
		if (Array.isArray(data)) {
			let services = data.map((service: any) => this.addService(service))
			return Promise.all(services)
		}
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

	protected getService (id: any, params?: any): any {
		return this.services.get(id, params)
	}
	protected findService (params?: any): any {
		return this.services.find(params)
	}

	protected removeService (id: any, params?: any): any {
		return this.services.remove(id, params)
	}

	protected serviceCheck (app: any, data: any): any {
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

	protected multiCheck (app: any): any {
		if (this.options.multiOptions) {
			this.services = this.serviceCheck(app, this.options.multiOptions)
			return this.services
		}
		this.services = this.serviceCheck(app, { service: 'multi-services', serviceOptions: { id: 'serviceId', disableStringify: true }})
		return this.services
	}
}