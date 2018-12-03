import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

import CertificateService, { ServiceClass } from '../src/certificate-service'

const debug = require('debug')('feathers-service-manager:certificate-service:test')

describe('feathers-service-manager:certificate-service', () => {
	const app = feathers()

	const options = {
		events: ['testing']
	}

	const withDefaults = {
		events: ['testing']
	}

	const certAttr = [{name: 'test', value: 'test'}]

	const certSettings = { days: 364 }

	const certData = {
		attributes: certAttr,
		settings: certSettings
	}

	const certDataNoSettings = {
		attributes: certAttr
	}

	app.use('certificates', CertificateService(options))
	const service = app.service('certificates')

	describe('Requiring', () => {
		it('exposes the Service Constructor', () => {
			expect(typeof CertificateService).to.equal('function')
		})
	})

	describe('Custom Methods', () => {
		const rawService = new ServiceClass(options)
		const rawWithDefaults = new ServiceClass(withDefaults)
		rawService.setup(app, 'raw-service')
		rawWithDefaults.setup(app, 'raw-with-defaults')
		describe('generateCertificate', () => {
			it('generates pem from provided attributes and settings', () => {
				return rawService.generateCertificate(certData).then((result: any) => {
					expect(result).to.have.property('private')
					expect(result).to.have.property('public')
					expect(result).to.have.property('cert')
				})
			})
			it('generates pem using default service settings if settings not provided', () => {
				return rawService.generateCertificate(certDataNoSettings).then((result: any) => {
					expect(result).to.have.property('private')
					expect(result).to.have.property('public')
					expect(result).to.have.property('cert')
				})
			})
			it('generates pem from null attributes if attributes not provided', () => {
				return rawService.generateCertificate({}).then((result: any) => {
					expect(result).to.have.property('private')
					expect(result).to.have.property('public')
					expect(result).to.have.property('cert')
				})
			})
		})
	})
	//describe('Common Service Tests', () => {
	//	base(app, errors, 'certificates')
	//})
})
