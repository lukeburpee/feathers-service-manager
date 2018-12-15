import { suite, test, slow, timeout } from 'mocha-typescript'
import { expect } from 'chai'
import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import { ServiceClass } from '../src/registry-service'

const debug = Debug('feathers-service-manager:registry-service:test')

describe('RegistryService', () => {
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
	})
})
