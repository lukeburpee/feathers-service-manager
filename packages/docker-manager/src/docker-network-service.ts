import { Application, Id, NullableId, Paginated, Params, ServiceMethods, SetupMethod } from '@feathersjs/feathers'
import errors from '@feathersjs/errors'
import { _ } from '@feathersjs/commons'
import { _select } from '@feathers-service-manager/utils'

import { ServiceClass as DockerBaseService } from './docker-base-service'

export default function (options: ServiceOptions) {
  return new ServiceClass(options)
}

const actions: any = {
  INSPECT: 'inspect',
  REMOVE: 'remove',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect'
}

export class ServiceClass extends DockerBaseService {
  constructor (private options: ServiceOptions) {
    super(options)
  }
  public getServiceType (): any {
  	return 'network-service'
  }
  public createNetwork (options: any): any {
    return this.client.createNetwork(options)
  }
  public getNetwork (id: Id): any {
    return this.client.getNetwork(id)
  }
  public listNetworks (options: any): any {
    return this.client.listNetworks(options)
  }
  public pruneNetworks (options: any): any {
    return this.client.pruneNetworks(options)
  }
  public executeAction (network: any, type: any, options: any): any {
    switch (type) {
      case actions.REMOVE:
        return network.remove(options)
      case actions.CONNECT:
        return network.connect(options)
      case actions.DISCONNECT:
        return network.disconnect(options)
      default:
        return network.inspect()
    }
  }
}