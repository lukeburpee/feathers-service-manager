import { expect } from 'chai'
import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
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
		const rawService = new ServiceClass(options)
		rawService.setup(app, '/methods')
		describe('execute', () => {
			it('creates a child process promise and adds child process to process store', () => {
				return rawService.execute({command: 'echo', args: ['test']}).then((result: any) => {
					expect(result).to.have.property('processId')
					expect(result.process).to.have.property('pid')
					expect(result.process).to.have.property('stdout')
					expect(result.process).to.have.property('stderr')
				})
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
		describe('kill', () => {})
	})
	// describe('Common Service Tests', () => {
	// base(app, errors, 'json')
	// })
})
