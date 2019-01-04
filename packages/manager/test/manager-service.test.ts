import { suite, test, slow, timeout } from 'mocha-typescript'
import { expect } from 'chai'
import feathers from '@feathersjs/feathers'
import { default as Debug } from 'debug'
import { cpus } from 'os'
import { ServiceClass } from '../src'

const debug = Debug('@feathers-service-manager:manager:test')

describe('Manager', () => {
	describe('Initialization', () => {
		@suite class CpuValidation extends ServiceClass {
			constructor(options: ManagerOptions) {
				super({ events: ['testing'] })
			}
			@test 'it throws an error if build cpu count set to zero' () {
				let buildCount = 0
				try {
					return this.setCpus ({ buildCount })
				}
				catch (e) {
					expect(e.message)
					.to.equal('manager service build count must be greater than zero.')
				}
			}
			@test 'it throws an error if proxy cpu count set to zero' () {
				let proxyCount = 0
				try {
					return this.setCpus ({ proxyCount })
				}
				catch (e) {
					expect(e.message)
					.to.equal('manager service proxy count must be greater than zero.')
				}
			}
			@test 'it throws an error if allocated cpus greater than system cpus' () {
				let c = cpus().length
				let buildCount = 1
				let proxyCount = c + 1
				try {
					return this.setCpus ({ buildCount, proxyCount })
				}
				catch (e) {
					expect(e.message)
					.to.equal('manager service cpu allocation must be less than or equal to available system cpus.')
				}
			}
		}
	})
	describe('Setup', () => {
		describe('Internal Services', () => {
			describe('Process Service', () => {
				@suite class registration extends ServiceClass {
					constructor(options: ManagerOptions) {
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
					constructor(options: ManagerOptions) {
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
					constructor(options: ManagerOptions) {
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
					constructor(options: ManagerOptions) {
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
					constructor(options: ManagerOptions) {
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
					constructor(options: ManagerOptions) {
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
			describe('Validatation', () => {
				describe('Missing Application Spec', () => {
					@suite class result extends ServiceClass {
						constructor(options: ManagerOptions) {
							super({events: ['testing']})
						}
						@test 'it throws an error' () {
							try {
								await this.createImplementation(this.store, this.storeIsService, { hydrate: true })
							}
							catch (e) {
								expect(e.message)
								.to.equal('spec required to create application.')
							}
						}
					}
				})
			})
			describe('hydrate option', () => {
				@suite class result extends ServiceClass {
					constructor(options: ManagerOptions) {
						super({events: ['testing']})
					}
					@test 'it runs all application pipeline tasks via the "hydrate" method' () {
						expect(true).to.be.true
					}
				}
			})
			describe('generate option', () => {
				@suite class result extends ServiceClass {
					constructor(options: ManagerOptions) {
						super({events: ['testing']})
					}
					@test 'it adds the "generate" task to the application pipeline' () {
						expect(true).to.be.true
					}
				}
			})
			describe('package option', () => {
				@suite class result extends ServiceClass {
					constructor(options: ManagerOptions) {
						super({events: ['testing']})
					}
					@test 'it adds the "package" task to application pipeline' () {
						expect(true).to.be.true
					}
				}
			})
			describe('run option', () => {
				@suite class result extends ServiceClass {
					constructor(options: ManagerOptions) {
						super({events: ['testing']})
					}
					@test 'it adds the "run" task to the application pipeline' () {
						expect(true).to.be.true
					}
				}
			})
		})
		describe('hydrate', () => {
			@suite class result extends ServiceClass {
				constructor(options: ManagerOptions) {
					super({events: ['testing'] })
				}
				@test 'it implements the "writeSpec" method' () {
					expect(true).to.be.true
				}
				@test 'it implements the "codeList" method' () {
					expect(true).to.be.true
				}
				@test 'it implements the "generate" method' () {
					expect(true).to.be.true
				}
				@test 'it implements the "package" method' () {
					expect(true).to.be.true
				}
				@test 'it implements the "run" method' () {
					expect(true).to.be.true
				}
			}
		})
		describe('updateStatus', () => {
			@suite class result extends ServiceClass {
				constructor(options: ManagerOptions) {
					super({events: ['testing'] })
				}
				@test `it updates an application's status by category in the application manifest` () {
					expect(true).to.be.true
				}
			}
			describe('manifest entry not supplied', () => {
				@suite class result extends ServiceClass {
					constructor(options: ManagerOptions) {
						super({events: ['testing'] })
					}
					@test `it collects and updates the application manifest entry by id` () {
						expect(true).to.be.true
					}
				}
			})
		})
		describe('writeSpec', () => {
			@suite class result extends ServiceClass {
				constructor(options: ManagerOptions) {
					super({events: ['testing']})
				}
				@test 'it writes the provided application spec json to a directory' () {
					expect(true).to.be.true
				}
			}
		})
		describe('writeCodeList', () => {
			@suite class result extends ServiceClass {
				constructor(options: ManagerOptions) {
					super({events: ['testing']})
				}
				@test 'it generates and writes a codelist to a directory' () {
					expect(true).to.be.true
				}
			}
		})
		describe('addPkgOptions', () => {
			@suite class result extends ServiceClass {
				constructor(options: ManagerOptions) {
					super({events: ['testing']})
				}
				@test 'it adds package method options to application package.json' () {
					expect(true).to.be.true
				}
			}
		})
		describe('generate', () => {
			@suite class result extends ServiceClass {
				constructor(options: ManagerOptions) {
					super({events: ['testing']})
				}
				@test 'it generates an application with provided id in tmp directory' () {
					expect(true).to.be.true
				}
				@test 'it updates the application "generated" status in application manifest' () {
					expect(true).to.be.true
				}
			}
			describe('manifest entry not provided', () => {
				@suite class result extends ServiceClass {
					constructor(options: ManagerOptions) {
						super({events: ['testing']})
					}
					@test `it collects the application manifest entry by id before generation` () {
						expect(true).to.be.true
					}
				}
			})
		})
		describe('package', () => {
			@suite class result extends ServiceClass {
				constructor(options: ManagerOptions) {
					super({events: ['testing']})
				}
				@test 'it packages a generated application with provided id in tmp directory' () {
					expect(true).to.be.true
				}
				@test 'it updates the application "packaged" status in application manifest' () {
					expect(true).to.be.true
				}
			}
			describe('manifest entry not provided', () => {
				@suite class result extends ServiceClass {
					constructor(options: ManagerOptions) {
						super({events: ['testing']})
					}
					@test `it collects the application manifest entry by id before packaging` () {
						expect(true).to.be.true
					}
				}
			})
		})
		describe('run', () => {
			@suite class result extends ServiceClass {
				constructor(options: ManagerOptions) {
					super({events: ['testing']})
				}
				@test 'it creates and launches an application cluster' () {
					expect(true).to.be.true
				}
				@test 'it updates the application "running" status in application manifest' () {
					expect(true).to.be.true
				}
			}
			describe('manifest entry not provided', () => {
				@suite class result extends ServiceClass {
					constructor(options: ManagerOptions) {
						super({events: ['testing']})
					}
					@test `it collects the application manifest entry by id before running application` () {
						expect(true).to.be.true
					}
				}
			})
		})
		describe('setWorkerLog', () => {
			@suite class result extends ServiceClass {
				constructor(options: ManagerOptions) {
					super({events: ['testing']})
				}
				@test 'it sets and creates the "online" log event for application worker' () {
					expect(true).to.be.true
				}
				@test 'it sets and creates the "disconnect" log event for application worker' () {
					expect(true).to.be.true
				}
				@test 'it sets the "listening" log event for application worker' () {
					expect(true).to.be.true
				}
				@test 'it sets and creates the "message" log event for application worker' () {
					expect(true).to.be.true
				}
				@test 'it sets and creates the "exit" log event for application worker' () {
					expect(true).to.be.true
				}
				@test 'it sets and creates the "error" log event for application worker' () {
					expect(true).to.be.true
				}
			}
		})
	})
})
