import { Application, Id, NullableId, Paginated, Params, ServiceMethods, SetupMethod } from '@feathersjs/feathers'
import errors from '@feathersjs/errors'
import { filterQuery, sorter, select, _ } from '@feathersjs/commons';
import sift from 'sift'

import { ConnectionClass } from '@feathers-service-manager/connection-service'

export default function (options: ServiceOptions) {
  return new Service(options)
}

export class Service extends ConnectionClass {
  public default!: any;
  public admin!: any;
  constructor (options: ServiceOptions) {
    super(options)
    this.client.then((client: any) => {
      if (options.defaultDb) {
        this.default = client.db(options.defaultDb)
      } else {
        this.default = client.db('default')
      }
      this.admin = this.default.admin()
      this.healthCheck().then((status: any) => {
        console.log(`mongodb service status: ${JSON.stringify(status)}`)
      })
    })
  }
  public getConnectionType (): string {
    return 'mongodb'
  }
  public getServiceType (): string {
    return 'base-service'
  }
  public healthCheck (): any {
    return new Promise(resolve => {
      this.admin.ping().then((status: any) => {
        resolve(status)
      })
    })
  }
  public getInstance (): any {
    return new Promise((resolve) => {
      resolve(this.admin)
    })
  }
  public getInfo (): any {
    return new Promise((resolve) => {
      resolve(this.admin.serverInfo())
    })
  }
  public close (): any {
    return new Promise((resolve) => {
      resolve(this.admin.close())
    })
  }
}