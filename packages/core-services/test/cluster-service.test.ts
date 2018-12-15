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
		describe('patchImplementation', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('verifyCreate', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('verifyPatch', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('verifyScale', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('verifyAllowed', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('sendVM', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('createW', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('createWS', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('scaleUp', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it' () {
					expect(true).to.be.true
				}
			}
		})
		describe('scaleDown', () => {
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
