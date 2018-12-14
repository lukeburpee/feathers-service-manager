import { suit, test, slow, timeout } from 'mocha-typescript'
import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import LogService from '../src/log-service'

const debug = Debug('feathers-service-manager:log-service:test')

describe('feathers-service-manager:log-service', () => {
	debug('log-service tests starting')
	const options = {
		events: ['testing']
	}

	const app = feathers()
	app.use('logs', LogService(options))
	// describe('Common Service Tests', () => {
	// base(app, errors, 'json')
	// })
})
