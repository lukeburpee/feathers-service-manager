import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import ClusterService from '../src/cluster-service'

const debug = Debug('feathers-service-manager:cluster-service:test')

describe('feathers-service-manager:cluster-service', () => {
	debug('cluster-service tests starting')
	const options = {
		events: ['testing']
	}

	const app = feathers()
	app.use('clusters', ClusterService(options))
	// describe('Common Service Tests', () => {
	// base(app, errors, 'json')
	// })
})
