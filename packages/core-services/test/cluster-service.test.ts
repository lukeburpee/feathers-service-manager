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
				@test async 'it creates cluster and workers' () {
					let cluster = await this.createImplementation(this.store, {
						count: 1,
						settings: {
							exec: 'echo',
							args: ['test'],
							silent: true
						}
					})
					expect(cluster.workers.length).to.equal(1)
				}
				@test async 'it adds cluster settings and worker ids to store' () {
					let cluster = await this.createImplementation(this.store, {
						count: 1,
						settings: {
							exec: 'echo',
							args: ['test'],
							silent: true
						}
					})
					expect(cluster.id in this.store).to.be.true
				}
			}
			describe('missing options', () => {
				@suite class results extends ServiceClass {
					constructor(options: ServiceOptions) {
						super({events:['testing'], disableStringify: true})
					}
					@test async 'throws an error if missing settings' () {
						await this.createImplementation(this.store, {
							count: 1
						}).catch((error: any) => {
							expect(error.message).to.equal(
								'cluster master settings and worker count required to create cluster.'
							)
						})
					}
					@test async 'throws an error if missing count' () {
						await this.createImplementation(this.store, {
							settings: {
								exec: 'echo',
								args: ['test'],
								silent: true
							}
						}).catch((error: any) => {
							expect(error.message).to.equal(
								'cluster master settings and worker count required to create cluster.'
							)
						})
					}
				}
			})
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
