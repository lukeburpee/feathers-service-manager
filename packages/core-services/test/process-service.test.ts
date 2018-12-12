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
			expect(rawService.processes._id).to.equal('processId')
		})
	})
	// describe('Common Service Tests', () => {
	// base(app, errors, 'json')
	// })
})
