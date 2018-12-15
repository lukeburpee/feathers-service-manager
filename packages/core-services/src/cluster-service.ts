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
			let workers = this.scaleUp(settings, count)
			return super.createImplementation(store, { id, settings, workers }, params)
		}
	}

	public patchImplementation (store: any, id: any, data: any, params?: any): any {
		if (id in store) {
			this.verifyPatch(data)
			let settings = store[id].settings
			let original = store[id].workers
			if (data.scaleUp) {
				let additional = this.scaleUp(settings, data.scaleUp)
				let workers = {
					...original,
					...additional
				}
				let count = Object.keys(workers).length
				return super.patchImplementation(store, id, { count, settings, workers }, params)
			}
			if (data.scaleDown) {
				let workers = this.scaleDown(original, data.scaleDown)
				let count = Object.keys(workers).length
				return super.patchImplementation(store, id, { count, settings, workers }, params)
			}
		}
		return this.throwNotFound(id)
	}

	public verifyCreate (options: any): any {
		if (!options.count || !options.settings) {
			throw new Error('cluster master settings and worker count required to create cluster.')
		}
		console.log('cluster create options verified.')
	}

	public verifyPatch (options: any): any {
		this.verifyScale(options)
		this.verifyAllowed(options)
		console.log('cluster patch options verified.')
	}

	public verifyScale (options: any): any {
		if (options.scaleUp && options.scaleDown) {
			throw new Error('cluster can only be scaled in one direction at a time.')
		}
	}

	public verifyAllowed (options: any): any {
		let allowed = ['scaleUp', 'scaleDown', 'close']
		Object.keys(options).map((o: any) => {
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
		let id = w.id
		w.on('message', (m: any) => {
			switch(m.type){
				case 'shutdown':
					return w.process.exit(0)
				default:
					return console.log(m)
			}
		})
		return id
	}

	public createWs (cluster: any, count: any): any {
		let ws: string[] = []
		for (let i = 0; i < count; i++) {
			let w = this.createW(cluster)
			ws = [...ws, w]
		}
		return ws
	}

	public scaleUp (settings: any, count: any): any {
		c.setupMaster(settings)
		let ws = this.createWs(c, count)
		return ws
	}

	public scaleDown (originals: any, count: any): any {
		let id
		let ws = originals
		let r: string[] = []
		for (let i = 0; i < count; i++) {
			id = ws[i]
			this.sendWM(id, {text: 'shutdown', from: 'master'})
			r = r.concat([id])
			ws = ws.slice(1)
		}
		for (let j = 0; j < r.length; j++) {
			setTimeout(() => {
				if (c.workers[r[j]]) {
					c.workers[r[j]]!.kill('SIGKILL')
				}
			}, 1000)
		}
		return ws
	}
}
