import { Application, Id, NullableId, Paginated, Params, ServiceMethods, SetupMethod } from '@feathersjs/feathers'
import errors from '@feathersjs/errors'
import { _ } from '@feathersjs/commons'
import { _select } from '@feathers-service-manager/utils'

import { Service as DockerBaseService } from './docker-base-service'

export default function (options: ServiceOptions) {
  return new Service(options)
}

const actions: any = {
  INSPECT: 'inspect',
  REMOVE: 'remove'
}

export class Service extends DockerBaseService {
  constructor (options: ServiceOptions) {
    super(options)
  }
  public getServiceType(): any {
  	return 'volume-service'
  }
  public createVolume (data: any, params?: Params): any {
  	return this.client.createVolume(data)
  }
  public getVolume (id: any): any {
    return this.client.getVolume(id)
  }
  public listVolumes (options: any): any {
    return this.client.listVolumes(options)
  }
  public pruneVolumes (options: any): any {
    return this.client.pruneVolumes(options)
  }
  public executeAction (volume: any, type: any, options: any): any {
    switch (type) {
      case actions.REMOVE:
        return volume.remove(options)
      default:
        return volume.image()
    }
  }
}
