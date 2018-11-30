import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

import CertificateService from '../src/certificate-service'

const debug = require('debug')('feathers-service-manager:certificate-service:test')

describe('feathers-service-manager:certificate-service', () => {
	const options = {
		events: ['testing']
	}

	const app = feathers()
	
	app.use('certificates', CertificateService(options))

	describe('Common Service Tests', () => {
		base(app, errors, 'certificates')
	})
})
