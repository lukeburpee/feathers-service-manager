import { Application, Id, NullableId, Paginated, Params, ServiceMethods, SetupMethod } from '@feathersjs/feathers'
import errors from '@feathersjs/errors'
import { _ } from '@feathersjs/commons'
import { _select } from '@feathers-service-manager/utils'

import { Service as MongoDBBaseService } from './mongodb-base-service'

export default function (options: ServiceOptions) {
  return new Service(options)
}

export class Service extends MongoDBBaseService {
  constructor (options: ServiceOptions) {
    super(options)
  }
  public getServiceType (): any {
  	return 'session-service'
  }
}