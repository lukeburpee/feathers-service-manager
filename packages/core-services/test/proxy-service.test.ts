import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

import ProxyService, { ServiceClass } from '../src/proxy-service'

const debug = require('debug')('feathers-service-manager:proxy-service:test')

describe('feathers-service-manager:proxy-service', () => {
	const options = {
		events: ['testing']
	}

	const app = feathers()
	
	app.use('proxy', JsonService(options))

	describe('Common Service Tests', () => {
		base(app, errors, 'proxy')
	})
})
