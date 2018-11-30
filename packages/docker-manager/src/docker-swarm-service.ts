import { Application, Id, NullableId, Paginated, Params, ServiceMethods, SetupMethod } from '@feathersjs/feathers'
import errors from '@feathersjs/errors'
import { _ } from '@feathersjs/commons'
import { _select } from '@feathers-service-manager/utils'

import { ServiceClass as DockerBaseService } from './docker-base-service'

export default function (options: ServiceOptions) {
  return new Service(options)
}

export class Service extends DockerBaseService {
  constructor (private options: ServiceOptions) {
    super(options)
  }
  public getServiceType (): any {
  	return 'swarm-service'
  }
  public createSwarm (data: any, params?: Params): any {
  	return Promise.resolve(this.client.swarmInit(data))
  }
  public joinSwarm (data: any, params?: Params): any {
    return Promise.resolve(this.client.swarmJoin(data))
  }
  public leaveSwarm (data: any, params?: Params): any {
    return Promise.resolve(this.client.swarmLeave(data))
  }
  public updateSwarm (data: any, params?: Params): any {
    return Promise.resolve(this.client.swarmUpdate(data))
  }
}