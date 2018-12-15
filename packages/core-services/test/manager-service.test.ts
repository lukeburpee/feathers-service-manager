import { suite, test, slow, timeout } from 'mocha-typescript'
import { expect } from 'chai'
import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import { ServiceClass } from '../src/manager-service'

const debug = Debug('feathers-service-manager:manager-service:test')

describe('ManagerService', () => {
	describe('Setup', () => {
		describe('Internal Services', () => {
			describe('Process Service', () => {
				@suite class registration extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					@test async 'registers process ("p") service' () {
						await this.setup(feathers(), '/x')
						expect(this.app.service('p')).to.not.equal(undefined)
					}
				}
			})
			describe('Proxy Service', () => {
				@suite class registration extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					@test async 'registers "proxy" service' () {
						await this.setup(feathers(), '/x')
						expect(this.app.service('proxy')).to.not.equal(undefined)
					}
				}
			})
			describe('Registry Service', () => {
				@suite class registration extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					@test async 'registers "registry" service' () {
						await this.setup(feathers(), '/x')
						expect(this.app.service('registry')).to.not.equal(undefined)
					}
				}
			})
			describe('Manifest Service', () => {
				@suite class registration extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					@test async 'registers "manifest" service' () {
						await this.setup(feathers(), '/x')
						expect(this.app.service('manifest')).to.not.equal(undefined)
					}
				}
			})
			describe('Cluster Service', () => {
				@suite class registration extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					@test async 'registers "cluster" service' () {
						await this.setup(feathers(), '/x')
						expect(this.app.service('cluster')).to.not.equal(undefined)
					}
				}
			})
			describe('Log Service', () => {
				@suite class registration extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					@test async 'registers "log" service' () {
						await this.setup(feathers(), '/x')
						expect(this.app.service('log')).to.not.equal(undefined)
					}
				}
			})
		})
	})
	describe('Custom Methods', () => {
		describe('createImplementation', () => {
			@suite class result extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events: ['testing']})
				}
				@test 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('register', () => {
			@suite class result extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events: ['testing']})
				}
				@test 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('hydrate', () => {
			@suite class result extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events: ['testing']})
				}
				@test 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('writeSpec', () => {
			@suite class result extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events: ['testing']})
				}
				@test 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('generate', () => {
			@suite class result extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events: ['testing']})
				}
				@test 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('compress', () => {
			@suite class result extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events: ['testing']})
				}
				@test 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('package', () => {
			@suite class result extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events: ['testing']})
				}
				@test 'it' () {
					expect(true).to.be.true
				}
			}
		})
	})
})
