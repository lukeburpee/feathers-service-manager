import { ConnectionServiceClass } from '@feathers-service-manager/core-services'

export default function (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends ConnectionServiceClass {
	public default!: any;
	public admin!: any;

	constructor (options: ServiceOptions) {
		super(options)
	}
	public connect (options: any): any {
		return this.getConnection(this.connectionId)
		.catch((error: any) => {
			return this.client.then((client: any) => {
				if (options.defaultDb) {
					this.default = client.db(options.defaultDb)
				} else {
					this.default = client.db('default')
				}
				this.admin = this.default.admin()
			}).then(() => {
				return this.createConnection(
					this.connectionId,
					this.client
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
			this.client.close().then(() => {
				this.connections.remove(this.connectionId)
				.then((connection: any) => {
					resolve(connection)
				})
			})
		})
	}
}