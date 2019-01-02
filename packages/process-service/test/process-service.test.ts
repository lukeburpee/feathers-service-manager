import { suite, test, slow, timeout } from 'mocha-typescript'
import { assert, expect } from 'chai'
import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import { ServiceClass } from '../src'

const debug = Debug('feathers-service-manager:process-service:test')

describe('ProcessService', () => {
	describe('Custom Methods', () => {
		describe('createImplementation', () => {
			@suite class results extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it creates a child process' () {
					let { id, cp } = await this.createImplementation(this.store, { command: 'echo', args: ['test']})
					cp = await cp
					expect(cp.stdout).to.equal('test')
				}
				@test async 'it adds child process to service store' () {
					let { id, cp } = await this.createImplementation(this.store, { command: 'echo', args: ['test']})
					expect(id in this.store).to.be.true
				}
			}
			@suite class missingCommand extends ServiceClass {
				constructor(options: ServiceOptions) {
					super({events:['testing'], disableStringify: true})
				}
				@test async 'it throws an error' () {
					this.createImplementation(this.store, {})
						.catch((error: any) => expect(error.message).to.equal('execute process requires a command.'))
				}
			}
		})
		describe('removeImplementation', () => {
			@suite class results extends ServiceClass {
				public testId!: any;
				public testCp!: any;
				constructor(options: ServiceOptions) {
					super({events: ['events'], disableStringify: true})
				}
				public async before () {
					let { id, cp } = await this.createImplementation(this.store, { command: 'echo', args: ['test']})
					this.testId = id
					this.testCp = cp
				}
				@test async 'it kills a child process' () {
					let test = await this.removeImplementation(this.store, this.testId)
					expect(test.id).to.equal(this.testId)
				}
				@test async 'it removes child process from service store' () {
					let test = await this.removeImplementation(this.store, this.testId)
					expect(test.id in this.store).to.be.false
				}
			}
		})
	})
})
