import feathers from '@feathersjs/feathers'
import { default as Debug } from 'debug'

import ConfigService from '../src/config-service'

const debug = Debug('feathers-service-manager:config-service:test')

describe('feathers-service-manager:config-service', () => {
	debug('config-service tests starting')
	const options = {
		events: ['testing']
	}

	const app = feathers()
	app.use('configs', ConfigService(options))

	// describe('Common Service Tests', () => {
	// base(app, errors, 'configs')
	// })
})
