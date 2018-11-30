import { Id, Params } from '@feathersjs/feathers'
import { NotFound } from '@feathersjs/errors'
import BaseService, { BaseServiceClass } from '@feathers-service-manager/base-service'
import { _select } from '@feathers-service-manager/utils'

export default function init (options: ServiceOptions) {
  return new Service(options)
}

export class Service extends BaseServiceClass {
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
		this.defaultOptions = options.defaultOptions || {}
		this.createConnection(
			options.connectionId || this.generateId(),
			options.client
		).then((connection: any) => {
			this.connectionId = connection.id
			console.log(`${this.getConnectionType()} connection created: ${this.connectionId}`)
		}).catch((error: any) => {
			console.log(`${this.getConnectionType()} failed to create connection: ${error.message}`)
		})
	}
	
	public throwNotFound (id: Id): NotFound {
    	throw new NotFound(`No record found for id '${id}'`)
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
		})).catch((error: any) => {
			throw new Error(`${this.getConnectionType()} failed to collectect connection info: ${error.message}`)
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
	public setup (app: any, path: string): any {
		if (typeof app.service('connections') === 'undefined') {
			app.use('connections', BaseService({events: ['testing']}))
		}
		this.app = app
		this.path = path
		this.connections = app.service('connections')
	}
}
