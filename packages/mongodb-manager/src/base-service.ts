import { ConnectionServiceClass } from '@feathers-service-manager/core-services'
export default function (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends ConnectionServiceClass {
	public default!: any;
	public admin!: any;
	public connection!: any;
	constructor (options: ServiceOptions) {
		super(options)
	}
	public connect (options: any): any {
		return this.getConnection(this.connectionId)
		.then((connection: any) => {
			this.connection = connection.client
			if (options.defaultDb) {
				this.default = this.connection.db(options.defaultDb)
			} else {
				this.default = this.connection.db('default')
			}
			this.admin = this.default.admin()
			return this.patchConnection(
				this.connectionId,
				{ members: connection.members.concat([this.memberId]) }
			)
		})
		.catch((error: any) => {
			return this.client.then((conn: any) => {
				this.connection = conn
				if (options.defaultDb) {
					this.default = conn.db(options.defaultDb)
				} else {
					this.default = conn.db('default')
				}
				this.admin = this.default.admin()
				return this.createConnection(
					this.connectionId,
					this.connection
				)
			})
		})
	}
	public getConnectionType (): string {
		return 'mongodb'
	}
	public getServiceType (): string {
		return 'base-service'
	}
	public healthCheck (): any {
		return new Promise(resolve => {
			this.admin.ping().then((status: any) => {
				resolve(status)
			})
		})
	}
	public getInfo (): any {
		return new Promise((resolve) => {
			resolve(this.admin.serverInfo())
		})
	}
	public close (): any {
		return new Promise((resolve) => {
			this.connection.close().then(() => {
				this.connections.remove(this.connectionId)
				.then((conn: any) => {
					resolve(conn)
				})
			})
		})
	}
}
