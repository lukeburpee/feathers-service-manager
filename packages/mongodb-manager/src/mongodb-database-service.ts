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
  	return 'database-service'
  }
  public createImplementation (store: any, data: any, params: Params): any {
    if (typeof this.client.then === 'function') {
      return this.client.then((client: any) => {
        return client.db(data.name, data.dbOptions || this.defaultOptions).stats()
        .then((results: any) => {
          let id = data[this.id] || this.generateId()
          let name = results.db
          delete results.db
          let storeData = {
            name,
            ...results
          }
          return Promise.resolve((store[id] = storeData))
          .then(_select(params, this.id))
        })
      })
    }
  	return this.client.db(data.name, data.dbOptions || this.defaultOptions).stats()
  	.then((results: any) => {
  		let id = data[this.id] || this.generateId()
  		let name = results.db
  		delete results.db
  		let storeData = {
  			name,
  			...results
  		}
  		return Promise.resolve((store[id] = storeData))
  		.then(_select(params, this.id))
  	})
  }
  //public removeImplementation(store: any, id: Id, params: Params): any {
  //  if (id in store) {
  //    this.getImplementation(this.store, id, params)
  //    .then((data: any) => {
  //      return this.client.db(data.name).dropDatabase()
  //      .then((results: any) => {
  //        return this.removeFromStore(store, id, params)
  //      })
  //    })
  //  }
  //  return Promise.reject(`No record found for ${id}`)
  //}
}
