import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import MultiService from '../src/multi-service'

const debug = Debug('feathers-service-manager:multi-service:test')

describe('feathers-service-manager:multi-service', () => {
	debug('multi-service tests starting')
	const options = {
		events: ['testing']
	}

	const app = feathers()
	app.use('multi', MultiService(options))
	// describe('Common Service Tests', () => {
	// base(app, errors, 'json')
	// })
})
