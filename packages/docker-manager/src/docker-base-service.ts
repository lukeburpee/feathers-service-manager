import { Id } from '@feathersjs/feathers'
import { ConnectionClass } from 'feathers-connection-service'

export default function init (options: ServiceOptions) {
  return new Service(options)
}

export class Service extends ConnectionClass {
	constructor (options: ServiceOptions) {
		super(options)
	}
	public getConnectionType (): string {
		return 'docker'
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
			resolve(this.client.info())
		})
	}
	public close (): any {
		return new Promise((resolve) => {
			resolve('nan')
		})
	}
}
