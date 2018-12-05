import { Id, Params } from '@feathersjs/feathers'
import { _select } from '@feathers-service-manager/utils'
import { default as Debug } from 'debug'
import BaseService, { ServiceClass as BaseServiceClass } from './base-service'

const debug = Debug('feathers-service-manager:core-services:connection-service')

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	public connections!: any;
	public connectionId!: any;
	public memberId!: any;
	public client!: any;
	public defaultOptions!: any;
	public options!: any;
	constructor (options: ServiceOptions) {
		super(options)
		if (!options.client && !options.connectionId) {
			throw new Error(`${this.getConnectionType()} client or connectionId must be provided`)
		}
		this.client = options.client
		this.connectionId = options.connectionId || this.generateId()
		this.memberId = this.generateId()
		this.defaultOptions = options.defaultOptions || {}
		this.connectionServiceCheck().then(() => {
			this.connect(options)
		})
		debug('connection-service initialized')
	}

	public setup (app: any, path: string): any {
		this.app = app
		this.path = path
	}

	public connect (options?: any): any {
		this.options = options
		return this.createConnection(
			this.connectionId,
			this.client
		)
	}

	public createConnection (id: Id, client: any): any {
		return this.getInfo().then(((info: any) => {
			const connection = {
				id,
				info,
				client,
				connectionType: this.getConnectionType(),
				serviceTypes: [this.getServiceType()],
				status: 'pending',
				members: [this.memberId]
			}
			return this.connections.create(connection)
		}))
		.then((result: any) => {
			debug(`${this.getConnectionType()} connection created: ${this.connectionId}`)
			return result
		})
		.catch((error: any) => {
			throw new Error(`${this.getConnectionType()} failed to connect ${this.getConnectionType()}: ${error.message}`)
		})
	}
	public getConnection (connectionId: any): any {
		return this.connections.get(connectionId)
	}
	public updateConnection (connectionId: any, data: any, params?: Params): any {
		return this.connections.update(connectionId, data, params)
	}
	public patchConnection (connectionId: any, data: any, params?: Params): any {
		return this.connections.patch(connectionId, data, params)
	}
	public removeConnection (connectionId: any): any {
		return this.connections.remove(connectionId)
	}
	public getConnectionId (): any {
		return this.connectionId
	}
	public getConnectionType (): string {
		return 'connection-base'
	}
	public getServiceType (): string {
		return 'connection-service'
	}
	public healthCheck (): any {
		return new Promise((resolve) => {
			resolve('nan')
		}).then((results: any) => {
			return results
		})
	}
	public getInfo (): any {
		return new Promise((resolve) => {
			resolve('nan')
		}).then((results: any) => {
			return results
		})
	}
	public getInstance (): any {
		return new Promise((resolve) => {
			resolve('nan')
		}).then((results: any) => {
			return results
		})
	}
	private connectionServiceCheck (): any {
		return new Promise(resolve => {
			if (typeof this.app.service('connection') === 'undefined') {
				debug(`no connection service found on provided application.
					${this.getConnectionType()} service will create connection service.`
				)
				this.app.use('connections', BaseService({id: 'id'}))
				this.connections = this.app.service('connections')
				return resolve()
			}
			this.connections = this.app.service('connections')
			return resolve()
		})
	}
}
