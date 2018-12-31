import { default as Debug } from 'debug'
import c from 'cluster'

import { ServiceClass as BaseServiceClass } from './base-service'

const debug = Debug('feathers-service-manager:core-services:cluster-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	constructor(options: ServiceOptions) {
		super(options)
	}

	public async createImplementation (store: any, data: any, params?: any): Promise<any> {
		this.verifyCreate(data)
		let id = data[this.id] || this.generateId()
		let count = data.count
		let settings = data.settings

		if (c.isMaster) {
			let workers = this.scaleUp(settings, [], count)
			return super.createImplementation(store, { id, settings, workers }, params)
		}
	}

	public async patchImplementation (store: any, id: any, data: any, params?: any): Promise<any> {
		if (id in store) {
			this.verifyPatch(data)
			let settings = store[id].settings
			let originals = store[id].workers
			if (data.scaleUp) {
				let workers = this.scaleUp(settings, originals, data.scaleUp)
				let count = workers.length
				return super.patchImplementation(store, id, { count, settings, workers }, params)
			}
			if (data.scaleDown) {
				let workers = this.scaleDown(originals, data.scaleDown)
				let count = workers.length
				return super.patchImplementation(store, id, { count, settings, workers }, params)
			}
		}
		return this.throwNotFound(id)
	}

	public verifyCreate (data: any): any {
		if (!data.count) {
			throw new Error('worker count required to create cluster.')
		}
		if (!data.settings) {
			throw new Error('cluster master settings required to create cluster.')
		}
	}

	public verifyPatch (data: any): any {
		this.verifyScale(data)
		this.verifyAllowed(data)
	}

	public verifyScale (data: any): any {
		if (data.scaleUp && data.scaleDown) {
			throw new Error('cluster can only be scaled in one direction at a time.')
		}
	}

	public verifyAllowed (data: any): any {
		let allowed = ['scaleUp', 'scaleDown', 'close']
		Object.keys(data).map((o: any) => {
			if (allowed.indexOf(o) === -1 ) {
				throw new Error(`no cluster service option ${o}.`)
			}
		})
	}

	public sendWM (id: any, m: any): any {
		return c.workers[id]!.send(m)
	}

	public createW (cluster: any): any {
		let w = cluster.fork()
		return w
	}

	public createWs (cluster: any, count: any): any {
		let ws: string[] = []
		for (let i = 0; i < count; i++) {
			let w = this.createW(cluster)
			ws = [...ws, w]
		}
		return ws
	}

	public scaleUp (settings: any, originals: any, count: any): any {
		c.setupMaster(settings)
		let add = this.createWs(c, count)
		let ws = [
			...originals,
			...add
		]
		return ws
	}

	public scaleDown (originals: any, count: any): any {
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
