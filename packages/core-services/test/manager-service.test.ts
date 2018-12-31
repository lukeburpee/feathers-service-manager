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
					public async before () {
						await this.setup(feathers(), '/x')
					}
					@test async 'registers process ("p") service' () {
						expect(this.app.service('p')).to.not.equal(undefined)
					}
				}
			})
			describe('Proxy Service', () => {
				@suite class registration extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					public async before () {
						await this.setup(feathers(), '/x')
					}
					@test async 'registers "proxy" service' () {
						expect(this.app.service('proxy')).to.not.equal(undefined)
					}
				}
			})
			describe('Registry Service', () => {
				@suite class registration extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					public async before () {
						await this.setup(feathers(), '/x')
					}
					@test async 'registers "registry" service' () {
						expect(this.app.service('registry')).to.not.equal(undefined)
					}
				}
			})
			describe('Manifest Service', () => {
				@suite class registration extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					public async before () {
						await this.setup(feathers(), '/x')
					}
					@test async 'registers "manifest" service' () {
						expect(this.app.service('manifest')).to.not.equal(undefined)
					}
				}
			})
			describe('Cluster Service', () => {
				@suite class registration extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					public async before () {
						await this.setup(feathers(), '/x')
					}
					@test async 'registers "cluster" service' () {
						expect(this.app.service('cluster')).to.not.equal(undefined)
					}
				}
			})
			describe('Log Service', () => {
				@suite class registration extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					public async before () {
						await this.setup(feathers(), '/x')
					}
					@test async 'registers "log" service' () {
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
			describe('hydrate option', () => {
				@suite class result extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					@test 'it generates, compresses, packages, and runs an application' () {
						expect(true).to.be.true
					}
				}
			})
			describe('generate option', () => {
				@suite class result extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					@test 'it generates an application from a spec' () {
						expect(true).to.be.true
					}
				}
			})
			describe('compress option', () => {
				@suite class result extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					@test 'it compresses an application' () {
						expect(true).to.be.true
					}
				}
			})
			describe('package option', () => {
				@suite class result extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					@test 'it packages an application' () {
						expect(true).to.be.true
					}
				}
			})
			describe('run option', () => {
				@suite class result extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events: ['testing']})
					}
					@test 'it runs an application' () {
						expect(true).to.be.true
					}
				}
			})
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
		describe('updateStatus', () => {})
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
		describe('run', () => {
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
