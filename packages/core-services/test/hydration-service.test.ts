import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import HydrationService from '../src/hydration-service'

const debug = Debug('feathers-service-manager:core-services:hydration-service:test')

describe('feathers-service-manager:core-services:hydration-service', () => {
	debug('hydration-service tests starting')
	const options = {
		events: ['testing']
	}

	const app = feathers()
	app.use('hydration', HydrationService(options))
	// describe('Common Service Tests', () => {
	// base(app, errors, 'json')
	// })
})
