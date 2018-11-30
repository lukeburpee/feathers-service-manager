import { Id, Params } from '@feathersjs/feathers'
import { NotFound } from '@feathersjs/errors'
import { _select } from '@feathers-service-manager/utils'
import BaseService, { ServiceClass as BaseServiceClass } from './base-service'

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	public connections!: any;
	public connectionId!: any;
	public client!: any;
	public defaultOptions!: any;

	constructor (options: ServiceOptions) {
		super(options)
		if (!options.client && !options.connectionId) {
			throw new Error(`${this.getConnectionType()} client or connectionId must be provided`)
		}
		this.client = options.client
		this.connectionId = options.connectionId || this.generateId()
		this.defaultOptions = options.defaultOptions || {}
		this.connect(options)
	}

	public setup (app: any, path: string): any {
		if (typeof app.service('connections') === 'undefined') {
			console.log(`no connection service`)
			app.use('connections', BaseService())
		}
		this.app = app
		this.path = path
		this.connectionServiceCheck(app)
	}

	private connectionServiceCheck (app: any): any {
		if (typeof app.service('connection') === 'undefined') {
			console.log(`no connection service found on provided application.
				${this.getConnectionType()} service will create connection service.`
			)
			app.use('connections', BaseService({}))
			this.connections = app.service('connections')
			return this.connections
		}
		this.connections = app.service('connections')
		return this.connections
	}

	public connect (options: any): any {
		return this.createConnection(
			this.connectionId,
			this.client
		)
	}

	public createConnection (id: any, client: any): any {
		return this.getInfo().then(((info: any) => {
			const connection = {
				id: id,
				connectionType: this.getConnectionType(),
				serviceTypes: [this.getServiceType()],
				status: 'pending',
				client,
				info: info
			}
			return this.connections.create(connection)
		}))
		.then((result: any) => {
			console.log(`${this.getConnectionType()} connection created: ${this.connectionId}`)
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
}
