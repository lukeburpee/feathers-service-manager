import { default as Debug } from 'debug'
import { cpus } from 'os'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import socketio from '@feathersjs/socketio'
import cluster from 'cluster'
import getStream from 'get-stream'
import { ServiceClass as BaseServiceClass } from './base-service'

const debug = Debug('feathers-service-manager:core-services:cluster-service')

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass extends BaseServiceClass {
	public clusterServer!: any;
	public clusterCount!: any;
	public workers!: any;
	constructor(options: ServiceOptions) {
		super(options)
		this.clusterCount = 2
		this.workers = []
	}
	public async createCluster (data: any): Promise<any> {
		if (cluster.isMaster) {
			for (let i = 0; i < this.clusterCount; i++) {
				this.workers.push(cluster.fork())
				this.workers[i].on('message', (m: any) => {
					console.log(m)
				})
			}
		} else {
			cluster.on('online', (w: any) => {
				console.log(`worker ${w.process.pid} is listening`)
			})
			cluster.on('exit', (w: any, c: any, s: any) => {
				console.log(`worker ${w.process.pid} died with code: ${c} and signal: ${s}`)
				console.log(`starting new worker`)
				cluster.fork()
				this.workers.push(cluster.fork())
				this.workers[this.workers.length - 1].on('message', (m: any) => {
					console.log(m)
				})
			})
		}
	}
	public async createClusterServer (port: any): Promise<any> {
		this.clusterServer = express(feathers())
		this.clusterServer.configure(socketio({
			transports: ['websocket']
		}))
		this.clusterServer.listen(port)
	}
}