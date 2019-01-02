import { suite, test, slow, timeout } from 'mocha-typescript'
import { expect } from 'chai'
import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import { ServiceClass } from '../src'

const debug = Debug('feathers-service-manager:task-service:test')

describe('TaskService', () => {
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