import { expect } from 'chai'
import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import { v4 as uuid } from 'uuid'
import ProcessService, { ServiceClass } from '../src/process-service'

const debug = Debug('feathers-service-manager:process-service:test')

describe('feathers-service-manager:process-service', () => {
	debug('process-service tests starting')
	const app = feathers()

	const options = {
		events: ['testing']
	}

	describe('Initialization', () => {
		const rawService = new ServiceClass(options)
		rawService.setup(app, '/test')
		it('adds processes service to app', () => {
			expect(app.service('processes')).to.not.equal(undefined)
		})
		it('attaches processes service to service', () => {
			expect(rawService.processes._id).to.equal('processId')
		})
	})
	describe('custom methods', () => {
		const processId = uuid()
		const rawService = new ServiceClass(options)
		rawService.setup(app, '/methods')
		describe('execute', () => {
			it('creates a child process promise and adds child process to process store', async () => {
				let cp = await rawService.execute({processId, command: 'echo', args: ['test']}).then((result: any) => {
					expect(result.processId).to.equal(processId)
					expect(result.cp).to.have.property('pid')
					expect(result.cp).to.have.property('stdout')
					expect(result.cp).to.have.property('stderr')
					return result.cp
				})
				let {stdout} = await cp
				expect(stdout.toString()).to.equal('test')
			})
			describe('missing command', () => {
				it('throws an error', () => {
					return rawService.execute({})
						.catch((error: any) => {
							expect(error.message).to.equal('execute process requires a command.')
						})
				})
			})
		})
		describe('kill', () => {
			before(() => {
				return rawService.execute({processId, command: 'echo', args: ['test']})
			})
			it('kills a child process and removes it from process store', () => {
				return rawService.kill(processId).then((result: any) => {
					expect(result.processId).to.equal(processId, processId)
					expect(result.cp).to.have.property('pid')
					return rawService.processes.get(processId)
						.catch(error => {
							expect(error.message).to.equal(`No record found for id '${processId}'`)
						})
				})
			})
		})
	})
	// describe('Common Service Tests', () => {
	// base(app, errors, 'json')
	// })
})
