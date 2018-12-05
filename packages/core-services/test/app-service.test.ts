import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'

import AppService from '../src/app-service'

const debug = Debug('feathers-service-manager:app-service:test')

describe('feathers-service-manager:app-service', () => {
	debug('app-service tests starting')
	const options = {
		events: ['testing']
	}

	const app = feathers()
	app.use('app', AppService(options))

	// describe('Common Service Tests', () => {
	// base(app, errors, 'proxy')
	// })
})
