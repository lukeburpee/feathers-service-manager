import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

import JsonService, { Service } from '../src/json-service'

const debug = require('debug')('feathers-service-manager:json-service:test')

describe('feathers-service-manager:json-service', () => {
	const options = {
		id: 'id',
		events: ['testing']
	}

	const app = feathers()
	
	app.use('json', JsonService(options))

	describe('Common Service Tests', () => {
		base(app, errors, 'json', 'id')
	})
})
