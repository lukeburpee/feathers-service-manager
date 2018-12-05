import { _ } from '@feathersjs/commons'
import { _select } from '@feathers-service-manager/utils'

import { ServiceClass as BaseServiceClass } from './base-service'

export default function (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
	}
	public getServiceType(): any {
		return 'users-service'
	}
}
