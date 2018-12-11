import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import StreamService from '../src/stream-service'

const debug = Debug('feathers-service-manager:stream-service:test')

describe('feathers-service-manager:stream-service', () => {
	debug('stream-service tests starting')
	const options = {
		events: ['testing']
	}

	const app = feathers()
	app.use('streams', StreamService(options))
	// describe('Common Service Tests', () => {
	// base(app, errors, 'json')
	// })
})
