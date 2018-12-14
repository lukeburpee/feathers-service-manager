import watch from 'watch'

import { ServiceClass as BaseServiceClass } from './base-service'

import { default as Debug } from 'debug'

const debug = Debug('feathers-service-manager:core-services:watcher-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	public watchers!: any;
	constructor (options: ServiceOptions) {
		super(options)
		this.watchers = {}
		debug('watcher-service initialized')
	}
	createWatcher (path: any): any {}
	removeWatcher (id: any): any {}
}
