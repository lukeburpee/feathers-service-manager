import { assert, expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import ConnectionService, { Service } from '../src/connection-service'
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

const debug = require('debug')('feathers-service-manager:connection-service:test')

describe('feathers-service-manager:connection-service', () => {
	let serviceOptionsMissingClient, serviceOptions, serviceOptionsConnectionId
	const app = feathers()
	serviceOptionsMissingClient = {
		events: ['testing']
	}
	serviceOptions = {
		connectionId: uuid(),
		client: {},
		events: ['testing']
	}
	serviceOptionsConnectionId = {
		client: serviceOptions.connectionId
	}

	describe('Initialization', () => {
		describe('Missing client option', () => {
			it('throws an error', () => {
				expect(() => new Service(serviceOptionsMissingClient))
				.to.throw('connection-base client must be provided')
			})
		})
	})
	describe('Requiring', () => {
		it('exposes the Service Constructor', () => {
			expect(typeof Service).to.equal('function')
		})
	})
	app.use('c-service', ConnectionService(serviceOptions))
	const cService = app.service('c-service')
	describe('Common Service Tests', () => {
		base(app, errors, 'c-service', 'id')
	})
	describe('Custom Methods', () => {
		const connId = uuid()
		const rawService = new Service(serviceOptions)
		rawService.setup(app, '/connection-service-test')
		describe('createConnection', () => {
			it('adds a connection to the connection store and returns the original connection data', () => {
				return rawService.createConnection(connId, 'client').then((result: any) => {
					expect(result.id).to.equal(connId)
					expect(result.client).to.equal('client')
				})
			})
		})

		describe('getConnection', () => {
			it('returns a connection from the connection store', () => {
				return rawService.getConnection(connId).then((result: any) => {
					expect(result.id).to.equal(connId)
					expect(result.client).to.equal('client')
				})
			})
		})

		describe('updateConnection', () => {
			it('updates an existing connection with provided data', () => {
				return rawService.getConnection(connId).then((results: any) => {
					return rawService.updateConnection(connId, {...results, status: 'ok'})
					.then((final: any) => {
						expect(final.id).to.equal(connId)
						expect(final.status).to.equal('ok')
					})
				})
			})
		})

		describe('patchConnection', () => {
			it('patches an existing connection with provided data', () => {
				return rawService.getConnection(connId).then((results: any) => {
					return rawService.patchConnection(connId, {...results, status: 'ok'})
					.then((final: any) => {
						expect(final.id).to.equal(connId)
						expect(final.status).to.equal('ok')
					})
				})
			})
		})

		describe('getConnectionId', () => {
			it(`returns the current service's connectionId`, () => {
				expect(rawService.getConnectionId()).to.equal(serviceOptions.connectionId)
			})
		})

		describe('getConnectionType', () => {
			it(`returns a promise placeholder for the service connectionType`, () => {
				expect(rawService.getConnectionType()).to.equal('connection-base')
			})
		})

		describe('getServiceType', () => {
			it(`returns a promise placeholder for the serviceType`, () => {
				expect(rawService.getServiceType()).to.equal('connection-service')
			})
		})

		describe('healthCheck', () => {
			it(`returns a promise placeholder for the service healthcheck`, () => {
				return rawService.healthCheck().then((result: any) => {
					expect(result).to.equal('nan')
				})
			})
		})

		describe('getInfo', () => {
			it(`returns a promise placeholder for service info check`, () => {
				return rawService.getInfo().then((result: any) => {
					expect(result).to.equal('nan')
				})
			})
		})

		describe('getInstance', () => {
			it(`returns a promise placeholder for the service instance check`, () => {
				return rawService.getInstance().then((result: any) => {
					expect(result).to.equal('nan')
				})
			})
		})

		describe('removeConnection', () => {
			it('removes a connection from the connection store and returns the removed connection', (() => {
				return rawService.removeConnection(serviceOptions.connectionId).then(result => {
					expect(result.id).to.equal(serviceOptions.connectionId)
				})
			}))
		})
	})
})
