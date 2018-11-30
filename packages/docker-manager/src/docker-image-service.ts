import { Application, Id, NullableId, Paginated, Params, ServiceMethods, SetupMethod } from '@feathersjs/feathers'
import errors from '@feathersjs/errors'
import { _ } from '@feathersjs/commons'
import { _select } from '@feathers-service-manager/utils'

import { ServiceClass as DockerBaseService } from './docker-base-service'

export default function (options: ServiceOptions) {
  return new Service(options)
}

const actions: any = {
  GET: 'get',
  HISTORY: 'history',
  PUSH: 'push',
  TAG: 'tag',
  REMOVE: 'remove'
}

export class Service extends DockerBaseService {
  constructor (options: ServiceOptions) {
    super(options)
  }
  public getServiceType(): any {
  	return 'image-service'
  }
  public createImage (auth: any, options: any): any {
  	return Promise.resolve(this.client.createImage(auth, options))
  }
  public loadImage (file: any, options: any): any {
    return Promise.resolve(this.client.loadImage(file, options))
  }
  public importImage (file: any, options: any): any {
    return Promise.resolve(this.client.importImage(file, options))
  }
  public buildImage (file: any, options: any): any {
    return Promise.resolve(this.client.buildImage(file, options))
  }
  public getImage (name: any): any {
    return Promise.resolve(this.client.getImage(name))
  }
  public listImages (options: any): any {
    return Promise.resolve(this.client.listImages(options))
  }
  public pruneImages (options: any): any {
    return Promise.resolve(this.client.pruneImages(options))
  }
  public executeAction (image: any, type: any, options: any): any {
    switch (type) {
      case actions.GET:
        return Promise.resolve(image.get())
      case actions.HISTORY:
        return Promise.resolve(image.history())
      case actions.PUSH:
        return Promise.resolve(image.push(options))
      case actions.TAG:
        return Promise.resolve(image.tag(options))
      case actions.REMOVE:
        return Promise.resolve(image.remove(options))
      default:
        return Promise.resolve(image.inspect())
    }
  }
}
