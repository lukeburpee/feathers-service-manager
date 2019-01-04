import redbird, { docker } from 'redbird'
import { _select } from '@feathers-service-manager/utils'
import { ServiceClass as BaseServiceClass } from '@feathers-service-manager/base-service'
import { default as Debug } from 'debug'

const debug = Debug('@feathers-service-manager:proxy-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
	}
	protected generateProxy (data: any): any {
		if (!data.port) {
			throw new Error(`proxy service requires port`)
		}
		const bunyan = data.bunyan || false
		const cluster = data.cluster ? data.cluster : null
		const port = data.port
		const ssl = data.ssl ? data.ssl : null

		const proxy = redbird({
			bunyan,
			cluster,
			port,
			ssl
		})
		if (data.register) {
			return this.registerRoutes(proxy, data.register)
				.then((registeredProxy: any) => {
					return registeredProxy
				})
		}
		return Promise.resolve(proxy)
	}
	protected registerRoutes (proxy: any, routes: any): any {
		return new Promise(resolve => {
			routes.forEach((route: any) => {
				if (route.options) {
					if (route.options.docker) {
						delete route.options.docker
						docker(proxy).register(route.src, route.target, route.options)
					} else {
						proxy.register(route.src, route.target, route.options)
					}
				} else {
					proxy.register(route.src, route.target)
				}
			})
			resolve(proxy)
		})
	}
	protected unregisterRoutes (proxy: any, routes: any): any {
		return new Promise(resolve => {
			routes.forEach((route: any) => {
				if (route.target === 'all') {
					proxy.unregister(route.src)
				} else {
					proxy.unregister(route.src, route.target)
				}
			})
			resolve(proxy)
		})
	}
	protected async createImplementation (store: any, storeIsService: boolean, data: any, params: any): Promise<any> {
		const id = data[this.id] || this.generateId()
		const proxy = await this.generateProxy(data)
		const current = {
			[this.id]: id,
			proxy
		}
		return super.createImplementation(store, storeIsService, current, params)
	}
	protected async patchImplementation (store: any, storeIsService: boolean, id: any, data: any, params: any): Promise<any> {
		if (id in store) {
			const proxy = store[id].proxy
			if (data.register) {
				return this.registerRoutes(proxy, data.register)
					.then((registeredProxy: any) => {
						if (data.unregister) {
							return this.unregisterRoutes(proxy, data.unregister)
								.then((unregisteredProxy: any) => {
									const patchedData = {
										[this.id]: id,
										proxy: unregisteredProxy
									}
									return Promise.resolve((store[id] = patchedData))
										.then(_select(params, this.id, this.disableStringify))
								})
						}
						const patchedData = {
							[this.id]: id,
							proxy: registeredProxy
						}
						return Promise.resolve((store[id] = patchedData))
							.then(_select(params, this.id, this.disableStringify))
					})
			}
			if (data.unregister) {
				return this.unregisterRoutes(proxy, data.unregister)
					.then((unregisteredProxy: any) => {
						const patchedData = {
							[this.id]: id,
							proxy: unregisteredProxy
						}
						return Promise.resolve((store[id] = patchedData))
							.then(_select(params, this.id, this.disableStringify))
					})
			}
		}
		return this.throwNotFound(id)
	}
	protected async removeImplementation (store: any, storeIsService: boolean, id: any, params?: any): Promise<any> {
		if (id in store) {
			const proxy = store[id].proxy
			proxy.close()
			return this.removeFromStore(store, id, params)
		}
		return this.throwNotFound(id)
	}
}
