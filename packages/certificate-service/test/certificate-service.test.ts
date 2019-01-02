import { suite, test, slow, timeout } from 'mocha-typescript'
import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import { v4 as uuid } from 'uuid'
import { default as Debug } from 'debug'

import { default as CertificateService } from '../src'

const debug = Debug('feathers-service-manager:certificate-service')

describe('feathers-service-manager:certificate-service:test', () => {
	const options = {
		events: ['testing']
	}
	describe('Requiring', () => {
		debug('starting certificate-service require test')
		it('exposes the Service Constructor', () => {
			expect(typeof CertificateService).to.equal('function')
		})
	})
	describe('Standard Service Methods', () => {
		describe('create', () => {
			const commonApp = feathers()
			commonApp.use('certificates', CertificateService(options))
			const certificates = commonApp.service('certificates')
			it(`creates and returns pem certificate with provided attributes and settings`, async () => {
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
				it('creates a certificate with null attributes', async () => {
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
				it('creates a certificate with null settings', async () => {
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
				it('throws an error', async () => {
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
			it('returns a certificate by id', async () => {
				return certificates.get(getId).then((result: any) => {
					expect(result).to.have.property('id', getId)
					expect(result).to.have.property('private')
					expect(result).to.have.property('public')
					expect(result).to.have.property('cert')
					expect(result).to.have.property('attributes')
					expect(result).to.have.property('settings')
				})
			})
			it('supports $select', async () => {
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
		describe('patch', () => {
			const commonApp = feathers()
			commonApp.use('certificates', CertificateService(options))
			const certificates = commonApp.service('certificates')
			const patchId = uuid()
			let current: any = {}
			before((done: any) => {
				certificates.create({
					id: patchId,
					attributes: {
						name: 'test'
					}
				}).then((result: any) => {
					current = result
					done()
				})
			})
			it('regenerates pems from current settings', async () => {
				return certificates.patch(patchId, {
					regenerate: true
				}).then((result: any) => {
					expect(result.id).to.equal(current.id)
					expect(result.attributes.name).to.equal(current.attributes.name)
					expect(result.settings).to.equal(current.settings)
					expect(result.private).to.not.equal(current.private)
					expect(result.public).to.not.equal(current.public)
					expect(result.cert).to.not.equal(current.cert)
				})
			})
			it('regenerates pem by id, using new attributes and settings', async () => {
				return certificates.patch(patchId, {
					attributes: {
						name: 'test_two'
					}
				}).then((result: any) => {
					expect(result).to.have.property('id', patchId)
					expect(result.private).to.not.equal(current.private)
					expect(result.public).to.not.equal(current.public)
					expect(result.cert).to.not.equal(current.cert)
				})
			})
			describe('id not found in store', () => {
				it('throws an error', async () => {
					const errorId = uuid()
					return certificates.patch(errorId, {
						attribuutes: {
							name: 'name'
						}
					}).catch((error: any) => {
						expect(error.message).to.equal(`No record found for id '${errorId}'`)
					})
				})
			})
			describe('patch data contains public, private, cert properties', () => {
				it('throws an error', async () => {
					return certificates.patch(patchId, {
						attributes: {
							name: 'test_three'
						},
						private: 'private'
					})
					.catch((error: any) => {
						expect(error.message)
						.to.equal(`certificate-service update error: certificate ${patchId} pem cannot be changed directly.`)
					})
				})
			})
		})
		describe('update', () => {
			const commonApp = feathers()
			commonApp.use('certificates', CertificateService(options))
			const certificates = commonApp.service('certificates')
			const updateId = uuid()
			let current: any = {}
			before((done: any) => {
				certificates.create({
					id: updateId,
					attributes: {
						name: 'test'
					}
				}).then((result: any) => {
					current = result
					done()
				})
			})
			it('regenerates pem by id, using new attributes and settings', async () => {
				return certificates.update(updateId, {
					attributes: {
						name: 'test_two'
					}
				}).then((result: any) => {
					expect(result).to.have.property('id', updateId)
					expect(result.private).to.not.equal(current.private)
					expect(result.public).to.not.equal(current.public)
					expect(result.cert).to.not.equal(current.cert)
				})
			})
			describe('id not found in store', () => {
				it('throws an error', async () => {
					const errorId = uuid()
					return certificates.update(errorId, {
						attribuutes: {
							name: 'name'
						}
					}).catch((error: any) => {
						expect(error.message).to.equal(`No record found for id '${errorId}'`)
					})
				})
			})
			describe('update data contains public, private, cert properties', () => {
				it('throws an error', async () => {
					return certificates.update(updateId, {
						attributes: {
							name: 'test_three'
						},
						private: 'private'
					})
					.catch((error: any) => {
						expect(error.message)
						.to.equal(`certificate-service update error: certificate ${updateId} pem cannot be changed directly.`)
					})
				})
			})
		})
	})
})
