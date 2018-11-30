import { Id } from '@feathersjs/feathers'
import { ConnectionServiceClass } from '@feathers-service-manager/connection-service'

export default function init (options: ServiceOptions) {
  return new Service(options)
}

export class Service extends ConnectionServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
	}
	public getConnectionType (): string {
		return 'ipfs'
	}
	public getServiceType (): string {
		return 'base-service'
	}
	public healthCheck (): any {
		return new Promise(resolve => {
			resolve('nan')
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
