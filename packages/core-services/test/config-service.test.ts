import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

import ConfigService from '../src/config-service'

const debug = require('debug')('feathers-service-manager:config-service:test')

describe('feathers-service-manager:config-service', () => {
	const options = {
		events: ['testing']
	}

	const app = feathers()
	
	app.use('configs', ConfigService(options))

	describe('Common Service Tests', () => {
		base(app, errors, 'configs')
	})
})
