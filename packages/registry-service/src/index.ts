import { _select } from '@feathers-service-manager/utils'

import { ServiceClass as BaseServiceClass } from '@feathers-service-manager/base-service'

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	public registryType!: any;
	public versionate!: any;
	public specKeys!: any;
	constructor (options: ServiceOptions);
	constructor (options: RegistryOptions) {
		super(options)
		this.registryType = `${options.registryType}-registry` || 'registry'
		this.versionate = options.versionate || false
		this.specKeys = options.specKeys || null
	}
	protected async createImplementation (store: any, storeIsService: boolean, data: any, params?: any): Promise<any> {
		this.validateCreate(data)
		let spec = data.spec
		if (this.versionate) {
			return super.createImplementation(store, storeIsService, { [data.version]: { spec }})
		}
		return super.createImplementation(store, storeIsService, { spec })
	}
	protected validateCreate (data: any): any {
		if (this.specKeys) {
			this.validateSpecKeys(data.spec)
		}
		if (this.versionate) {
			if (!data.version) {
				throw new Error('Registry service is versionated. Please provide version when creating spec.')
			}
		}
		if (!data.spec) {
			throw new Error('registery service requires spec.')
		}
	}
	protected validateSpecKeys (spec: any): any {
		let specKeys = Object.keys(spec)
		specKeys.forEach((key: any) => {
			if (!this.specKeys.includes(key)) {
				throw new Error(`Invalid spec provided to ${this.registryType} service.`)
			}
		})
		return true
	}
}
