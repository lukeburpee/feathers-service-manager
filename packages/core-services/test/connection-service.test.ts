import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import { v4 as uuid } from 'uuid'
import { default as Debug } from 'debug'

import { default as BaseService } from '../src/base-service'
import { default as ConnectionService, ServiceClass } from '../src/connection-service'

const debug = Debug('feathers-service-manager:core-services:base-service:tests')

describe('feathers-service-manager:connection-service', () => {
	debug('connection-service tests starting')
	const app = feathers()
	const setupApp = feathers()
	const missingConnectionId = {
		client: {},
		events: ['testing']
	}

	const missingClient = {
		events: ['testing']
	}

	const options = {
		connectionId: uuid(),
		client: {},
		events: ['testing']
	}

	setupApp.use('internal', BaseService({
		id: 'internalId',
		events:['events']
	}))
	const optionsProvidedService = {
		connectionId: uuid(),
		client: {},
		connectionService: setupApp.service('internal'),
		events: ['testing']
	}

	app.use('conns', ConnectionService(options))
	app.use('conns-missing-connectionId', ConnectionService(missingConnectionId))

	describe('Requiring', () => {
		it('exposes the Service Constructor', () => {
			expect(typeof ConnectionService).to.equal('function')
		})
	})

	describe('Initialization', () => {
		describe('setup', () => {
			describe('internal connection service', () => {
				describe('connection service does not exist on app at setup', () => {
					const rawService = new ServiceClass(options)
					rawService.setup(setupApp, '/internal-service-test')
					it('adds connection service to application', () => {
						expect(setupApp.service('connections')).to.not.equal(undefined)
					})
					it('uses the created service as internal connection service', () => {
						expect(rawService.connections._id).to.equal('connectionId')
					})
				})
				describe('connection service provided in service options', () => {
					const rawService = new ServiceClass(optionsProvidedService)
					rawService.setup(setupApp, '/internal-service-provided-test')
					it('uses the provided service as the internal connection service', () => {
						expect(rawService.connections._id).to.equal('internalId')
					})
				})
			})
		})
		describe('custom options', () => {
			describe('connectionId option', () => {
				it('sets the service connectionId', () => {
					expect(app.service('conns')).to.have.property('connectionId', options.connectionId)
				})
				describe('missing', () => {
					it('generates a new connectionId and attaches the id to the service', () => {
						expect(app.service('conns-missing-connectionId')).to.have.property('connectionId')
					})
				})
			})
			describe('client option', () => {
				describe('missing', () => {
					it('throws an error', () => {
						expect(() => new ServiceClass(missingClient))
						.to.throw('connection-base client or connectionId must be provided')
					})
				})
			})
		})
	})

	describe('Custom Methods', () => {
		const connId = uuid()
		const rawService = new ServiceClass(options)
		rawService.setup(app, '/connection-service-test')
		describe('createConnection', () => {
			it('adds a connection to the connection store and returns the original connection data', () => {
				return rawService.createConnection(connId, 'client').then((result: any) => {
					expect(result.connectionId).to.equal(connId)
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
				expect(rawService.getConnectionId()).to.equal(options.connectionId)
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
				return rawService.removeConnection(options.connectionId).then((result: any) => {
					expect(result.id).to.equal(options.connectionId)
				})
			}))
		})
	})
	// describe('Common Service Tests', () => {
	// base(app, errors, 'conns')
	// })
})
