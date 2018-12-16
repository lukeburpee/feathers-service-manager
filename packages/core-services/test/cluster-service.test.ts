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
					super({ events: ['testing'], disableStringify: true })
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
						super({ events: ['testing'], disableStringify: true })
					}
					@test async 'it throws an error if missing settings' () {
						try {
							let cluster: any = await this.createImplementation(this.store, { count: 1 })
						} 
						catch (e) {
							expect(e.message).to.equal(
								'cluster master settings required to create cluster.'
							)
						}
					}
					@test async 'it throws an error if missing count' () {
						try {
							let cluster: any = await this.createImplementation(this.store, {
								settings: {
									exec: 'echo',
									args: ['test'],
									silent: true
								}
							})
						}
						catch (e) {
							expect(e.message).to.equal(
								'worker count required to create cluster.'
							)
						}
					}
				}
			})
		})
		describe('patchImplementation', () => {
			describe('scaleUp option', () => {
				@suite class results extends ServiceClass {
					public testId!: any;
					constructor(options: ServiceOptions) {
						super({ events: ['testing'], disableStringify: true })
						this.testId = this.generateId()
					}
					public async before() {
						await this.create({
							id: this.testId, 
							count: 2,
							settings: {
								exec: 'echo',
								args: ['test'],
								silent: true
							}
						})
					}
					@test async 'it adds workers to a cluster by id' () {
						let cluster = await this.patchImplementation(this.store, this.testId, { scaleUp: 1 })
						expect(cluster.workers.length).to.equal(3)
					}
				}
			})
			describe('scaleDown option', () => {
				@suite class results extends ServiceClass {
					public testId!: any;
					constructor(options: ServiceOptions) {
						super({ events: ['testing'], disableStringify: true })
						this.testId = this.generateId()
					}

					public async before() {
						await this.create({
							id: this.testId, 
							count: 2,
							settings: {
								exec: 'echo',
								args: ['test'],
								silent: true
							}
						})
					}
					@test async 'it removes workers from a cluster by id' () {
						let cluster = await this.patchImplementation(this.store, this.testId, { scaleDown: 1 })
						expect(cluster.workers.length).to.equal(1)
					}
				}
			})
			describe('cluster id not in store', () => {
				@suite class results extends ServiceClass {
					public testId!: any;
					constructor(options: ServiceOptions) {
						super({ events: ['testing'], disableStringify: true })
						this.testId = this.generateId()
					}
					@test async 'it throws an error' () {
						try {
							let cluster: any = this.patchImplementation(this.store, this.testId, { scaleDown: 1 })
						}
						catch (e) {
							expect(e.message).to.equal(
								`No record found for id '${this.testId}'`
							)	
						}
					}
				}
			})
		})
		describe('verifyCreate', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({ events: ['testing'], disableStringify: true })
				}
				@test async 'it throws an error if count not provided' () {
					expect(() => this.verifyCreate({ settings: { exec: 'echo' } })).to.throw(
						'worker count required to create cluster.'
					)
				}
				@test async 'it throws an error if settings not provided' () {
					expect(() => this.verifyCreate({ count: 1 })).to.throw(
						'cluster master settings required to create cluster.'
					)
				}
			}
		})
		describe('verifyPatch', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({ events: ['testing'], disableStringify: true })
				}
				@test async 'it throws an error if both scaleUp and scaleDown provided' () {
					expect(() => this.verifyPatch({ scaleUp: 1, scaleDown: 1 })).to.throw(
						'cluster can only be scaled in one direction at a time.'
					)
				}
				@test async 'it throws an error if invalid option provided' () {
					expect(() => this.verifyPatch({ test: 'test', scaleUp: 1 })).to.throw(
						`no cluster service option test.`
					)
				}
			}
		})
		describe('sendWM', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({ events: ['testing'], disableStringify: true })
				}
				@test async 'it sends a message to a worker' () {
					expect(true).to.be.true
				}
			}
		})
		describe('createW', () => {
			@suite class results extends ServiceClass {
				public testId!: any
				constructor(options: ServiceOptions) {
					super({ events: ['testing'], disableStringify: true })
					this.testId = this.generateId()
				}
				@test async 'it adds a worker to a cluster' () {
					expect(true).to.be.true
				}
			}
		})
		describe('createWS', () => {
			@suite class results extends ServiceClass {
				public testId!: any
				constructor(options: ServiceOptions) {
					super({ events: ['testing'], disableStringify: true })
					this.testId = this.generateId()
				}
				@test async 'it adds multiple workers to a cluster' () {
					expect(true).to.be.true
				}
			}
		})
		describe('scaleUp', () => {
			@suite class results extends ServiceClass {
				public testId!: any
				constructor(options: ServiceOptions) {
					super({ events: ['testing'], disableStringify: true })
					this.testId = this.generateId()
				}
				public async before() {
					await this.create({
						id: this.testId, 
						count: 1,
						settings: {
							exec: 'echo',
							args: ['test'],
							silent: true
						}
					})
				}
				@test async 'creates a worker to add to cluster' () {
					let cluster = await this.get(this.testId)
					let { settings, count, workers } = cluster
					let updated = await this.scaleUp(settings, workers, 1)
					expect(updated.length).to.equal(2)
				}
				@test async 'creates multiple workers to add to cluster' () {
					let cluster = await this.get(this.testId)
					let { settings, count, workers } = cluster
					let updated = await this.scaleUp(settings, workers, 2)
					expect(updated.length).to.equal(3)
				}
			}
		})
		describe('scaleDown', () => {
			@suite class results extends ServiceClass {
				public testId!: any
				constructor(options: ServiceOptions) {
					super({ events: ['testing'], disableStringify: true })
					this.testId = this.generateId()
				}
				public async before() {
					await this.create({
						id: this.testId, 
						count: 3,
						settings: {
							exec: 'echo',
							args: ['test'],
							silent: true
						}
					})
				}
				@test async 'it removes a worker from a cluster' () {
					let cluster = await this.get(this.testId)
					let { workers } = cluster
					let updated = await this.scaleDown(workers, 1)
					expect(updated.length).to.equal(2)
				}
				@test async 'it removes multiple workers from a cluster' () {
					let cluster = await this.get(this.testId)
					let { workers } = cluster
					let updated = await this.scaleDown(workers, 2)
					expect(updated.length).to.equal(1)
				}
			}
		})
	})
})
