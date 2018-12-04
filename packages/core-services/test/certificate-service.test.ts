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
	describe('Requiring', () => {
		it('exposes the Service Constructor', () => {
			expect(typeof CertificateService).to.equal('function')
		})
	})
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
					expect(result).to.have.property('attributes')
					expect(result).to.have.property('settings')
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
						expect(result).to.have.property('attributes', null)
						expect(result).to.have.property('settings')
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
						expect(result).to.have.property('attributes')
						expect(result).to.have.property('settings', null)
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
					expect(result).to.have.property('attributes')
					expect(result).to.have.property('settings')
				})
			})
			it('supports $select', () => {
				return certificates.get(getId, { query: {$select: ['cert'] }}).then((result: any) => {
					expect(result).to.have.property('id')
					expect(result).to.have.property('cert')
					expect(result).to.not.have.property('private')
					expect(result).to.not.have.property('public')
					expect(result).to.not.have.property('attributes')
					expect(result).to.not.have.property('settings')
				})
			})
		})
	})
})
