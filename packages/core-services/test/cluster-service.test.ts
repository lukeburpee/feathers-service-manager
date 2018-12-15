import { suite, test, slow, timeout } from 'mocha-typescript'
import { assert, expect } from 'chai'
import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import { ServiceClass } from '../src/cluster-service'

const debug = Debug('feathers-service-manager:cluster-service:test')

describe('ClusterService', () => {
	describe('Custom Methods', () => {
		describe('createImplementation', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('createWorker', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('createWorkers', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it' () {
					expect(true).to.be.true
				}
			}
		})
	})
})
