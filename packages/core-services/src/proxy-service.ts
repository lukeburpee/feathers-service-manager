import { ServiceClass as BaseServiceClass } from './base-service'

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
	}
}
