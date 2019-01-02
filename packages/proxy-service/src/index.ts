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
	public generateProxy (data: any): any {
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
	public registerRoutes (proxy: any, routes: any): any {
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
	public unregisterRoutes (proxy: any, routes: any): any {
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
	public createImplementation (store: any, data: any, params: any): any {
		let id = data[this.id] || this.generateId()
		return this.generateProxy(data).then((proxy: any) => {
			const current = {
				[this.id]: id,
				proxy
			}
			return Promise.resolve((store[id] = current))
				.then(_select(params, this.id, this.disableStringify))
		})
	}
	public patchImplementation (store: any, id: any, data: any, params: any): any {
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
	public removeImplementation (store: any, id: any, params?: any): any {
		if (id in store) {
			const proxy = store[id].proxy
			proxy.close()
			return this.removeFromStore(store, id, params)
		}
		return this.throwNotFound(id)
	}
}
