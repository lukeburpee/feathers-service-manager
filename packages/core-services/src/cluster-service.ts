import { default as Debug } from 'debug'
import { cpus } from 'os'
import c from 'cluster'

import { ServiceClass as BaseServiceClass } from './base-service'

const debug = Debug('feathers-service-manager:core-services:cluster-service')

export default function init (options: ServiceOptions) {
	return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	public cpuCount!: any;
	public defaultCount!: any;
	constructor(options: ServiceOptions) {
		super(options)
		this.cpuCount = cpus().length
		this.defaultCount = options.defaultCount || 2
	}
	public async createImplementation (store: any, data: any, params?: any): Promise<any> {
		let count = data.count || this.defaultCount
		let cluster = data.cluster || c
		let workers = {}
		if (cluster.isMaster) {
			workers = this.createWorkers(cluster, count)
		} else {
			cluster.on('online', (w: any) => console.log(`worker ${w.process.pid} is listening`))
			cluster.on('exit', (w: any, c: any, s: any) => this.createWorker(cluster))
		}
		return super.createImplementation(store, { cluster, workers }, params)
	}
	public createWorker (cluster: any): any {
		let id = this.generateId()
		let worker = cluster.fork()
		worker.on('message', (m: any) => console.log(m))
		let current = {
			id,
			worker,
			messages: []
		}
		return current
	}
	public createWorkers (cluster: any, count: any): any {
		let workers = {}
		for (let i = 0; i < count; i++) {
			let worker = this.createWorker(cluster)
			workers = {
				...workers,
				[worker.id]: worker
			}
		}
		return workers
	}
}
