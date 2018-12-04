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
	const options = {
		events: ['testing']
	}
	//app.use('certificates', CertificateService(options))
	//const service = app.service('certificates')
	describe('Requiring', () => {
		it('exposes the Service Constructor', () => {
			expect(typeof CertificateService).to.equal('function')
		})
	})
	//describe('Custom Methods', () => {
	//	const rawService = new ServiceClass(options)
	//	const rawWithDefaults = new ServiceClass(withDefaults)
	//	rawService.setup(app, 'raw-service')
	//	rawWithDefaults.setup(app, 'raw-with-defaults')
	//	describe('generateCertificate', () => {
	//		it('generates pem from provided attributes and settings', () => {
	//			return rawService.generateCertificate({
	//				attributes: { name: 'test' },
	//				settings: { days: 364 }
	//			}).then((result: any) => {
	//				expect(result).to.have.property('private')
	//				expect(result).to.have.property('public')
	//				expect(result).to.have.property('cert')
	//			})
	//		})
	//		it('generates pem using default service settings if settings not provided', () => {
	//			return rawService.generateCertificate({
	//				attributes: { name: 'test' }
	//			}).then((result: any) => {
	//				expect(result).to.have.property('private')
	//				expect(result).to.have.property('public')
	//				expect(result).to.have.property('cert')
	//			})
	//		})
	//		it('generates pem from null attributes if attributes not provided', () => {
	//			return rawService.generateCertificate({
	//			}).then((result: any) => {
	//				expect(result).to.have.property('private')
	//				expect(result).to.have.property('public')
	//				expect(result).to.have.property('cert')
	//			})
	//		})
	//		describe('Invalid Pem Certificate Attributes', () => {
	//			it ('throws an error', () => {
	//				return rawService.generateCertificate({
	//					attributes: { test: 'test' }
	//				})
	//				.catch((error: any) => {
	//					expect(error.message).to.equal('certificate-service error: Invalid certificate attribute test')
	//				})
	//			})
	//		})
	//	})
	//})
	//describe('Base Service Methods', () => {
	//	let store = {}
	//	const rawService = new ServiceClass(options)
	//	rawService.setup(app, 'raw-service')
	//	describe('createImplementation', () => {
	//		it(`generates pem, stores pem in provided storage, and returns the generated pem`, () => {
	//			return rawService.createImplementation(store, {
	//				attributes: {
	//					name: 'test'
	//				}
	//			}).then((result: any) => {
	//				expect(result).to.have.property('id', store[result.id].id)
	//				expect(result).to.have.property('private', store[result.id].private)
	//				expect(result).to.have.property('public', store[result.id].public)
	//				expect(result).to.have.property('cert', store[result.id].cert)
	//			})
	//		})
	//	})
	//})
	describe('Standard Service Methods', () => {
		describe('create', () => {
			const commonApp = feathers()
			commonApp.use('certificates', CertificateService(options))
			const certificates = commonApp.service('certificates')
			it(`creates and returns pem certificate with provided attributes and settings`, () => {
				return certificates.create({
					attributes: {
						name: 'test'
					},
					settings: {
						days: 364
					}
				}).then((result: any) => {
					expect(result).to.have.property('id')
					expect(result).to.have.property('private')
					expect(result).to.have.property('public')
					expect(result).to.have.property('cert')
				})
			})
			describe('missing attributes', () => {
				it('creates a certificate with null attributes', () => {
					return certificates.create({
						settings: {
							days: 364
						}
					}).then((result: any) => {
						expect(result).to.have.property('id')
						expect(result).to.have.property('private')
						expect(result).to.have.property('public')
						expect(result).to.have.property('cert')
					})
				})
			})
			describe('missing settings', () => {
				it('creates a certificate with null settings', () => {
					return certificates.create({
						attributes: {
							name: 'test'
						}
					}).then((result: any) => {
						expect(result).to.have.property('id')
						expect(result).to.have.property('private')
						expect(result).to.have.property('public')
						expect(result).to.have.property('cert')
					})
				})
			})
			describe('invalid attributes', () => {
				it('throws an error', () => {
					return certificates.create({
						attributes: {
							test: 'test'
						},
						settings: {
							days: 364
						}
					}).catch((error: any) => {
						expect(error.message).to.equal('certificate-service error: Invalid certificate attribute test')
					})
				})
			})
		})
		describe('get', () => {
			const commonApp = feathers()
			commonApp.use('certificates', CertificateService(options))
			const certificates = commonApp.service('certificates')
			const getId = uuid()
			before((done: any) => {
				certificates.create({
					id: getId,
					attributes: {
						name: 'test'
					}
				}).then(() => {
					done()
				})
			})
			it('returns a certificate by id', () => {
				return certificates.get(getId).then((result: any) => {
					expect(result).to.have.property('id', getId)
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
