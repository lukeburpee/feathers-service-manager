import { suite, test, slow, timeout } from 'mocha-typescript'
import { assert, expect } from 'chai'
import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import { ServiceClass as ProcessService } from '../src/process-service'

const debug = Debug('feathers-service-manager:process-service:test')

describe('ProcessService', () => {
	describe('Custom Methods', () => {
		@suite class createImplementation extends ProcessService {
			constructor(options: ServiceOptions) {
				super({events:['testing']})
			}
			@test async 'it creates a child process' () {
				let { id, cp } = await this.createImplementation(this.store, { command: 'echo', args: ['test']})
				expect(cp).to.have.property('stdout')
				expect(cp).to.have.property('stderr')
			}
			@test async 'it adds child process to service store' () {
				let { id, cp } = await this.createImplementation(this.store, { command: 'echo', args: ['test']})
				expect(id in this.store).to.be.true
			}
		}
		@suite class removeImplementation extends ProcessService {
			public testId!: any;
			public testCp!: any;
			constructor(options: ServiceOptions) {
				super({events: ['events']})
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