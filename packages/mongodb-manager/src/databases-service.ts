import { default as Debug } from 'debug'
import { Params } from '@feathersjs/feathers'
import { _, select } from '@feathersjs/commons'

import { ServiceClass as BaseServiceClass } from './base-service'

const debug = Debug('feathers-service-manager:mongodb-manager:database-service')

export default function (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor (options: ServiceOptions) {
		super(options)
	}
	public getServiceType(): any {
		return 'databases-service'
	}
	public createImplementation (store: any, data: any, params?: any): any {
		if (!data.name) {
			throw new Error('name required to create new mongodb database')
		}
		let id = data[this.id] || this.generateId()
		let name = data.name
		const db = this.connection.db(data.name, data.options || {})
		return db.stats()
			.then((stats: any) => {
				const current = {
					[this.id]: id,
					name,
					stats,
					db
				}
				return current
			})
			.then((current: any) => {
				return Promise.resolve(store[id] = current)
				.then(select(params, this.id))
			})
	}
}

