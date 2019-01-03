import { suite, test, slow, timeout } from 'mocha-typescript'
import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import { v4 as uuid } from 'uuid'
import { default as Debug } from 'debug'

import { default as CertificateService, ServiceClass } from '../src'

const debug = Debug('feathers-service-manager:certificate-service')

describe('CertificateService', () => {
	describe('Standard Service Methods', () => {
		describe('create', () => {
			@suite class result extends ServiceClass {
				constructor(options: CertificateOptions) {
					super({ events: ['testing'], disableStringify: true })
				}
				@test(timeout(10000)) async 'it create pem with provided attributes and settings' () {
					let attributes = { name: 'test' }
					let settings = { days: 364 }
					let pem = await this.create({ attributes, settings })
					expect(pem).to.have.property('id')
					expect(pem).to.have.property('private')
					expect(pem).to.have.property('public')
					expect(pem).to.have.property('cert')
					expect(pem).to.have.property('attributes')
					expect(pem).to.have.property('settings')
					return pem
				}
			}
			describe('missing attributes', () => {
				@suite class result extends ServiceClass {
					constructor(options: CertificateOptions) {
						super({ events: ['testing'], disableStringify: true })
					}
					@test(timeout(10000)) async 'it create pem with null attributes' () {
						let settings = { days: 364 }
						let pem = await this.create({ settings })
						expect(pem).to.have.property('id')
						expect(pem).to.have.property('private')
						expect(pem).to.have.property('public')
						expect(pem).to.have.property('cert')
						expect(pem).to.have.property('attributes')
						expect(pem).to.have.property('settings')
						return pem
					}
				}
			})
			describe('missing settings', () => {
				@suite class result extends ServiceClass {
					constructor(options: CertificateOptions) {
						super({ events: ['testing'], disableStringify: true })
					}
					@test(timeout(10000)) async 'it creates pem with null settings' () {
						let attributes = { name: 'test' }
						let pem = await this.create({ attributes })
						expect(pem).to.have.property('id')
						expect(pem).to.have.property('private')
						expect(pem).to.have.property('public')
						expect(pem).to.have.property('cert')
						expect(pem).to.have.property('attributes')
						expect(pem).to.have.property('settings')
						return pem
					}
				}
			})
			describe('invalid attributes', () => {
				@suite class result extends ServiceClass {
					constructor(options: CertificateOptions) {
						super({ events: ['testing'], disableStringify: true })
					}
					@test(timeout(10000)) async 'it throws an error' () {
						let attributes = { test: 'test' }
						let settings = { days: 364 }
						try {
							await this.create({ attributes, settings })
						}
						catch (e) {
							expect(e.message).to.equal('certificate-service error: Invalid certificate attribute test')
						}
					}
				}
			})
		})
		describe('get', () => {
			@suite class result extends ServiceClass {
				public testId!: string;
				public testPem!: any;
				constructor(options: CertificateOptions) {
					super({ events: ['testing'], disableStringify: true })
					this.testId = this.generateId()
				}
				public async before() {
					let attributes = { name: 'test' }
					let settings = { days: 360 }
					this.testPem = await this.create({ id: this.testId, attributes, settings })
					return this.testPem
				}
				@test(timeout(10000)) async 'it returns a certificate by id' () {
					let pem = await this.get(this.testId)
					expect(pem.id).to.equal(this.testId)
					return pem
				}
				@test(timeout(10000)) async 'it supports $select' () {
					let pem = await this.get(this.testId, { query: { $select: ['cert'] }})
					expect(pem.id).to.equal(this.testPem.id)
					expect(pem.cert).to.equal(this.testPem.cert)
					expect(pem).to.not.have.property('public')
					return pem
				}
			}
		})
		describe('patch', () => {
			@suite class result extends ServiceClass {
				public testId!: string;
				public testPem!: any;
				constructor(options: CertificateOptions) {
					super({ events: ['testing'], disableStringify: true })
					this.testId = this.generateId()
				}
				public async before() {
					let attributes = { name: 'test' }
					let settings = { days: 360 }
					this.testPem = await this.create({ id: this.testId, attributes, settings })
					return this.testPem
				}
				@test(timeout(10000)) async 'it regenerates pem by id, using current attributes and settings' () {
					let pem = await this.patch(this.testId, { regenerate: true })
					expect(pem.id).to.equal(this.testId)
					expect(pem.attributes.name).to.equal('test')
					expect(pem.settings.days).to.equal(360)
					expect(pem.private).to.not.equal(this.testPem.private)
					expect(pem.public).to.not.equal(this.testPem.public)
					expect(pem.cert).to.not.equal(this.testPem.cert)
					return pem
				}
				@test(timeout(10000)) async 'it regenerates pems with new attributes' () {
					let attributes = { name: 'new-attributes' }
					let pem = await this.patch(this.testId, { attributes })
					expect(pem.id).to.equal(this.testId)
					expect(pem.attributes.name).to.equal('new-attributes')
					expect(pem.settings.days).to.equal(360)
					expect(pem.private).to.not.equal(this.testPem.private)
					expect(pem.public).to.not.equal(this.testPem.public)
					expect(pem.cert).to.not.equal(this.testPem.cert)
					return pem
				}
				@test(timeout(10000)) async 'it regenerates pems with new settings' () {
					let settings = { days: 320 }
					let pem = await this.patch(this.testId, { settings })
					expect(pem.id).to.equal(this.testId)
					expect(pem.attributes.name).to.equal('test')
					expect(pem.settings.days).to.equal(320)
					expect(pem.private).to.not.equal(this.testPem.private)
					expect(pem.public).to.not.equal(this.testPem.public)
					expect(pem.cert).to.not.equal(this.testPem.cert)
					return pem
				}
			}
			describe('id not found in store', () => {
				@suite class result extends ServiceClass {
					public testId!: string;
					constructor(options: CertificateOptions) {
						super({ events: ['testing'], disableStringify: true })
						this.testId = this.generateId()
					}
					@test(timeout(10000)) async 'it throws an error' () {
						try {
							await this.patch(this.testId, { regenerate: true })
						}
						catch (e) {
							expect(e.message).to.equal(`No record found for id '${this.testId}'`)
						}
					}
				}
			})
			describe('patch data contains public, private, cert properties', () => {
				@suite class result extends ServiceClass {
					public testId!: string;
					constructor(options: CertificateOptions) {
						super({ events: ['testing'], disableStringify: true })
						this.testId = this.generateId()
					}
					public async before() {
						await this.create({ id: this.testId })
					}
					@test(timeout(10000)) async 'it throws an error' () {
						try {
							this.patch(this.testId, { public: 'test' })
						}
						catch (e) {
							expect(e.message)
							.to.equal(`certificate-service update error: certificate ${this.testId} pem cannot be changed directly.`)
						}
					}
				}
			})
		})
		describe('update', () => {
			@suite class result extends ServiceClass {
				public testId!: string;
				public testPem!: any;
				constructor(options: CertificateOptions) {
					super({ events: ['testing'], disableStringify: true })
					this.testId = this.generateId()
				}
				public async before () {
					let attributes = { name: 'test' }
					let settings = { days: 300 }
					this.testPem = await this.create({ id: this.testId, attributes, settings })
					return this.testPem
				}
				@test(timeout(10000)) async 'regenerates pem by id, using new attributes and settings' () {
					let attributes = { name: 'new-attributes' }
					let settings = { days: 320 }
					let pem = await this.update(this.testId, { attributes, settings })
					expect(pem.id).to.equal(this.testId)
					expect(pem.attributes.name).to.equal('new-attributes')
					expect(pem.settings.days).to.equal(320)
					expect(pem.cert).to.not.equal(this.testPem.cert)
					expect(pem.public).to.not.equal(this.testPem.public)
					expect(pem.private).to.not.equal(this.testPem.private)
					return pem
				}
			}
			describe('id not found in store', () => {
				@suite class result extends ServiceClass {
					public testId!: string;
					constructor(options: CertificateOptions) {
						super({ events: ['testing'], disableStringify: true })
						this.testId = this.generateId()
					}
					@test(timeout(10000)) async 'it throws an error' () {
						try {
							let attributes = { name: 'test' }
							let settings = { days: 320 }
							await this.update(this.testId, { attributes, settings })
						}
						catch (e) {
							expect(e.message)
							.to.equal(`No record found for id '${this.testId}'`)
						}
					}
				}
			})
			describe('update data contains public, private, cert properties', () => {
				@suite class result extends ServiceClass {
					public testId!: string;
					public testPem!: any;
					constructor(options: CertificateOptions) {
						super({ events: ['testing'], disableStringify: true })
						this.testId = this.generateId()
					}
					public async before () {
						await this.create({ id: this.testId })
					}
					@test(timeout(10000)) async 'it throws an error' () {
						try {
							await this.update(this.testId, { public: 'test' })
						}
						catch (e) {
							expect(e.message)
							.to.equal(`certificate-service update error: certificate ${this.testId} pem cannot be changed directly.`)
						}
					}
				}
			})
		})
	})
})
