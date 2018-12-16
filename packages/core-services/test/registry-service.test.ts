import { suite, test, slow, timeout } from 'mocha-typescript'
import { expect } from 'chai'
import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import { ServiceClass } from '../src/registry-service'

const debug = Debug('feathers-service-manager:registry-service:test')

let spec = {
	"options": {
		"ver": "1.0.0",
		"inspectConflicts": false,
		"semicolons": false,
		"freeze": [],
		"ts": true
	},
	"app": {
		"environmentsAllowingSeedData": "",
		"seedData": false
	},
	"services": {},
	"hooks": {}
}

describe('RegistryService', () => {
	describe('Custom Methods', () => {
		describe('createImplementation', () => {
			@suite class result extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({ events: ['testing'] })
				}
				@test async 'creates and returns an app spec' () {
					let test = await this.createImplementation(this.store, { spec })
					expect(test.spec.options).to.exist
				}
				@test async 'adds app spec to store' () {
					let test = await this.createImplementation(this.store, { spec })
					expect(test.id in this.store).to.be.true
				}
			}
		})
		describe('verifyCreate', () => {
			@suite class result extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({ events: ['testing'] })
				}
				@test async 'it throws an error if missing spec' () {
					let id = this.generateId()
					this.createImplementation(this.store, { id })
						.catch((error: any) => {
							expect(error.message).to.equal(
								'registery service requires application spec.'
							)
						})
				}
			}
		})
	})
})
