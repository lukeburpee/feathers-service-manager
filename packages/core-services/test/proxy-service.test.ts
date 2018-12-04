import feathers from '@feathersjs/feathers';
import * as Debug from 'debug'

import ProxyService from '../src/proxy-service'

const debug = Debug('feathers-service-manager:proxy-service:test')

describe('feathers-service-manager:proxy-service', () => {
	debug('proxy-service tests starting')
	const options = {
		events: ['testing']
	}

	const app = feathers()
	app.use('proxy', ProxyService(options))

	// describe('Common Service Tests', () => {
	// base(app, errors, 'proxy')
	// })
})
