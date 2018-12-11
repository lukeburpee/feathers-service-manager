import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import ProcessService from '../src/process-service'

const debug = Debug('feathers-service-manager:process-service:test')

describe('feathers-service-manager:process-service', () => {
	debug('process-service tests starting')
	const options = {
		events: ['testing']
	}

	const app = feathers()
	app.use('processes', ProcessService(options))
	// describe('Common Service Tests', () => {
	// base(app, errors, 'json')
	// })
})
