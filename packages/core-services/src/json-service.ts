import load from 'load-json-file'
import write from 'write-json-file'

import { ServiceClass as WatcherServiceClass } from './watcher-service'

import { default as Debug } from 'debug'

const debug = Debug('feathers-service-manager:core-services:json-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends WatcherServiceClass {
	public json!: any;
	constructor (options: ServiceOptions) {
		super(options)
	}
	public setup (app: any, path: any): any {
		return load(this.options.filePath)
			.then((result: any) => {
				this.json = result
				debug('json-service initialized')
			})
	}
}
