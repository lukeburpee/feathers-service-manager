import { suite, test, slow, timeout } from 'mocha-typescript'
import { expect } from 'chai'
import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import { ServiceClass } from '../src'

const debug = Debug('@feathers-service-manager:manifest-service:test')

describe('ManifestService', () => {
	describe('Custom Methods', () => {
		describe('createImplementation', () => {
			@suite class result extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({ events: ['testing'] })
				}
				@test async 'creates and returns an app manifest entry' () {
					let appId = this.generateId()
					let entry = await this.createImplementation(this.store, this.storeIsService, { appId, cores: 1, status: 'running' })
					expect(entry.appId).to.exist
				}
				@test async 'adds manifest entry to store' () {
					let appId = this.generateId()
					let entry = await this.createImplementation(this.store, this.storeIsService, { appId, cores: 1, status: 'running' })
					expect(entry.id in this.store).to.be.true
				}
			}
		})
		describe('verifyCreate', () => {
			@suite class result extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({ events: ['testing'] })
				}
				@test async 'it throws an error if missing appId' () {
					this.createImplementation(this.store, this.storeIsService, { cores: 1, status: 'running' })
						.catch((error: any) => {
							expect(error.message).to.equal(
								'manifest service requires an app identifier.'
							)
						})
				}
				@test async 'it throws an error if missing cores' () {
					let appId = this.generateId()
					this.createImplementation(this.store, this.storeIsService, { appId, status: 'running' })
						.catch((error: any) => {
							expect(error.message).to.equal(
								'manifest service requires core count.'
							)
						})
				}
				@test async 'it throws an error if missing status' () {
					let appId = this.generateId()
					this.createImplementation(this.store, this.storeIsService, { appId, cores: 1 })
						.catch((error: any) => {
							expect(error.message).to.equal(
								'manifest service requires app status.'
							)
						})
				}
			}	
		})
	})
})
