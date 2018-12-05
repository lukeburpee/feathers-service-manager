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
				this.createConnection(
					this.connectionId,
					client
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
	public getInstance (): any {
		return new Promise((resolve) => {
			resolve(this.admin)
		})
	}
	public getInfo (): any {
		let output: any = {}
		return new Promise((resolve) => {
			this.default.stats().then((info: any) => {
				resolve(info)
			})
		})
	}
	public close (): any {
		return new Promise((resolve) => {
			resolve(this.admin.close())
		})
	}
}
