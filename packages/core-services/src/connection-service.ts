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
	constructor (options: ServiceOptions) {
		super(options)
		if (!options.client && !options.connectionId) {
			throw new Error(`${this.getConnectionType()} client or connectionId must be provided`)
		}
		this.client = options.client
		this.connectionId = options.connectionId || this.generateId()
		this.memberId = this.generateId()
		this.defaultOptions = options.defaultOptions || {}
		debug('connection-service initialized')
	}

	public setup (app: any, path: string): any {
		super.setup(app, path)
		this.connectionServiceCheck(app).then((connections: any) => {
			this.connect(this.options, connections)
		})
	}

	public connect (options?: any, connections?: any): any {
		this.options = options
		return this.createConnection(
			this.connectionId,
			this.client,
			connections
		)
	}

	public createConnection (id: Id, client: any, connections?: any): any {
		const service = connections || this.connections
		return this.getInfo().then(((info: any) => {
			const connection = {
				[service._id]: id,
				info,
				client,
				connectionType: this.getConnectionType(),
				serviceTypes: [this.getServiceType()],
				status: 'pending',
				members: [this.memberId]
			}
			return service.create(connection)
		}))
		.then((result: any) => {
			debug(`${this.getConnectionType()} connection created: ${this.connectionId}`)
			return result
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
	private connectionServiceCheck (app: any): any {
		return new Promise(resolve => {
			if (this.options.connectionService) {
				if (typeof this.options.connectionService === 'string') {
					if (typeof app.service(this.options.connectionService) === 'undefined') {
						debug(
							`no service ${this.options.connectionService} found on application setup. 
							${this.getConnectionType()} service will create ${this.options.connectionService} service.`
						)
						app.use(this.options.connectionService, BaseService({id: `${this.options.connectionService}Id`}))
					}
					this.connections = app.service(this.options.connectionService)
					return resolve(this.connections)
				}
				debug(`using provided connection service as internal service`)
				this.connections = this.options.connectionService
				return resolve(this.connections)
			}
			if (typeof app.service('connection') === 'undefined') {
				debug(
					`no connection service found on application setup. ${this.getConnectionType()} service will create connection service.`
				)
				app.use('connections', BaseService({id: 'connectionId'}))
			}
			this.connections = app.service('connections')
			return resolve(this.connections)
		})
	}
}
