import { default as Debug } from 'debug'
import c from 'cluster'

import { ServiceClass as BaseServiceClass } from '@feathers-service-manager/base-service'

const debug = Debug('feathers-service-manager:core-services:cluster-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor(options: ServiceOptions) {
		super(options)
	}

	protected async createImplementation (store: any, storeIsService: boolean, data: any, params?: any): Promise<any> {
		this.verifyCreate(data)
		let id = data[this.id] || this.generateId()
		let count = data.count
		let settings = data.settings

		if (c.isMaster) {
			let workers = this.scaleUp(settings, [], count)
			return super.createImplementation(store, storeIsService, { id, settings, workers }, params)
		}
	}

	protected async patchImplementation (store: any, storeIsService: boolean, id: any, data: any, params?: any): Promise<any> {
		if (id in store) {
			this.verifyPatch(data)
			let settings = store[id].settings
			let originals = store[id].workers
			if (data.scaleUp) {
				let workers = this.scaleUp(settings, originals, data.scaleUp)
				let count = workers.length
				return super.patchImplementation(store, storeIsService, id, { count, settings, workers }, params)
			}
			if (data.scaleDown) {
				let workers = this.scaleDown(originals, data.scaleDown)
				let count = workers.length
				return super.patchImplementation(store, storeIsService, id, { count, settings, workers }, params)
			}
		}
		return this.throwNotFound(id)
	}

	protected verifyCreate (data: any): any {
		if (!data.count) {
			throw new Error('worker count required to create cluster.')
		}
		if (!data.settings) {
			throw new Error('cluster master settings required to create cluster.')
		}
	}

	protected verifyPatch (data: any): any {
		this.verifyScale(data)
		this.verifyAllowed(data)
	}

	protected verifyScale (data: any): any {
		if (data.scaleUp && data.scaleDown) {
			throw new Error('cluster can only be scaled in one direction at a time.')
		}
	}

	protected verifyAllowed (data: any): any {
		let allowed = ['scaleUp', 'scaleDown', 'close']
		Object.keys(data).map((o: any) => {
			if (allowed.indexOf(o) === -1 ) {
				throw new Error(`no cluster service option ${o}.`)
			}
		})
	}

	protected sendWM (id: any, m: any): any {
		return c.workers[id]!.send(m)
	}

	protected createW (cluster: any): any {
		let w = cluster.fork()
		return w
	}

	protected createWs (cluster: any, count: any): any {
		let ws: string[] = []
		for (let i = 0; i < count; i++) {
			let w = this.createW(cluster)
			ws = [...ws, w]
		}
		return ws
	}

	protected scaleUp (settings: any, originals: any, count: any): any {
		c.setupMaster(settings)
		let add = this.createWs(c, count)
		let ws = [
			...originals,
			...add
		]
		return ws
	}

	protected scaleDown (originals: any, count: any): any {
		let id
		let ws = originals
		let r: string[] = []
		for (let i = 0; i < count; i++) {
			id = ws[i].id
			this.sendWM(id, { text: 'shutdown', from: 'master' })
			r = r.concat([id])
			ws = ws.slice(1)
		}
		return ws
	}
}
