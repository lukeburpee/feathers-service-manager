import { _select } from '@feathers-service-manager/utils'

import { ServiceClass as DockerBaseService } from './docker-base-service'

export default function (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends DockerBaseService {
	constructor (options: ServiceOptions) {
		super(options)
	}
	public getServiceType (): any {
		return 'swarm-service'
	}
	public createSwarm (data: any): any {
		return Promise.resolve(this.client.swarmInit(data))
	}
	public joinSwarm (data: any): any {
		return Promise.resolve(this.client.swarmJoin(data))
	}
	public leaveSwarm (data: any): any {
		return Promise.resolve(this.client.swarmLeave(data))
	}
	public updateSwarm (data: any): any {
		return Promise.resolve(this.client.swarmUpdate(data))
	}
}
