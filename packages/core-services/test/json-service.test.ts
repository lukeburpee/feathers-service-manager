import feathers from '@feathersjs/feathers';
import * as Debug from 'debug'
import JsonService from '../src/json-service'

const debug = Debug('feathers-service-manager:json-service:test')

describe('feathers-service-manager:json-service', () => {
	debug('json-service tests starting')
	const options = {
		events: ['testing']
	}

	const app = feathers()
	app.use('json', JsonService(options))
	// describe('Common Service Tests', () => {
	// base(app, errors, 'json')
	// })
})
