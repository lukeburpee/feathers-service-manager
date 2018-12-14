import load from 'load-json-file'
import write from 'write-json-file'

import { ServiceClass as BaseServiceClass } from './base-service'

import { default as Debug } from 'debug'

const debug = Debug('feathers-service-manager:core-services:json-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	public json!: any;
	constructor (options: ServiceOptions) {
		super(options)
		if (!options.file) {
			throw new Error(`json service requires a file path.`)
		}
	}
	public setup (app: any, path: any): any {
		return load(this.options.filePath)
			.then((result: any) => {
				this.json = result
				debug('json-service initialized')
			})
	}
}
