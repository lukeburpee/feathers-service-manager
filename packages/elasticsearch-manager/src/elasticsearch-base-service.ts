import { ConnectionServiceClass } from '@feathers-service-manager/core-services'

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends ConnectionServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
	}

	public getConnectionType (): string {
		return 'elasticsearch'
	}
	public getServiceType (): string {
		return 'base-service'
	}
	public healthCheck (): any {
		return new Promise(resolve => {
			resolve(this.client.ping())
		})
	}
	public getInfo (): any {
		return new Promise((resolve) => {
			resolve('nan')
		})
	}
	public close (): any {
		return new Promise((resolve) => {
			resolve('nan')
		})
	}
}
