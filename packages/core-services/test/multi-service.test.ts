import { suite, test, slow, timeout } from 'mocha-typescript'
import { expect } from 'chai'
import feathers from '@feathersjs/feathers'
import { default as Debug } from 'debug'
import { v4 as uuid } from 'uuid'
import BaseService from '../src/base-service'
import MultiService, { ServiceClass } from '../src/multi-service'

const debug = Debug('feathers-service-manager:multi-service:test')

describe('feathers-service-manager:multi-service', () => {
	debug('multi-service tests starting')
	const app = feathers()
	const setupApp = feathers()
	const externalApp = feathers()

	setupApp.use('test', BaseService({ id: 'test', events: ['testing'], disableStringify: true }))

	externalApp.use('setup-test', BaseService({ id: 'setupTest', events: ['testing'], disableStringify: true }))
	externalApp.use('method-test', BaseService({ id: 'methodTest', events: ['testing'], disableStringify: true }))

	app.use('existing-service', BaseService({ id: 'existingService', events: ['testing'], disableStringify: true }))

	const options = {
		events: ['testing']
	}

	const multiOptions = {
		events: ['testing'],
		multiOptions: {
			service: 'test-services',
			serviceOptions: { 
				id: 'testId',
				disableStringify: true
			}
		}
	}

	const multiService = {
		events: ['testing'],
		multiOptions: {
			service: setupApp.service('test')
		}
	}

	const externalService = {
		events: ['testing'],
		multiOptions: {
			service: externalApp.service('setup-test')
		}
	}

	describe('initialization', () => {
		describe('internal service storage', () => {
			describe('multiOptions not provided', () => {
				const rawService = new ServiceClass(options)
				rawService.setup(setupApp, '/test')
				describe('service storage does not exist at setup', () => {
					it(`adds 'multi-services' service to application`, () => {
						expect(setupApp.service('multi-services')).to.not.equal(undefined)
					})
					it('uses created service as service storage', () => {
						expect(rawService.services._id).to.equal('serviceId')
					})
				})
			})
			describe('multiOptions provided', () => {
				describe('multiOptions service is string', () => {
					const rawService = new ServiceClass(multiOptions)
					rawService.setup(setupApp, '/test-multi-string')
					describe('multiOptions service does not exist at setup', () => {
						it('adds provided service to application', () => {
							expect(setupApp.service('test-services')).to.not.equal(undefined)
						})
						it('uses the provided service as service storage', () => {
							expect(rawService.services._id).to.equal('testId')
						})
					})
				})
				describe('multiOptions service is service', () => {
					describe('provided service uses internal app', () => {
						const rawService = new ServiceClass(multiService)
						rawService.setup(setupApp, '/multi-service-test')
						it('uses the provided service as service storage', () => {
							expect(rawService.services._id).to.equal('test')
						})
					})
					describe('provided service uses external app', () => {
						const rawService = new ServiceClass(externalService)
						rawService.setup(setupApp, '/external-service-test')
						it('uses the provided service as service storage', () => {
							expect(rawService.services._id).to.equal('setupTest')
						})
					})

				})
			})
		})
	})
	describe('custom methods', () => {
		const serviceId = uuid()
		const externalServiceId = uuid()
		const externalAppId = uuid()
		const existingServiceId = uuid()
		const rawService = new ServiceClass(multiService)
		rawService.setup(app, '/multi')
		describe('addService', () => {
			it('adds a service to the service store and returns added service', async () => {
				return rawService.addService({test: serviceId, service: 'testing', serviceOptions: { id: 'testId', disableStringify: true }})
					.then((result: any) => {
						expect(result.test).to.equal(serviceId)
						expect(result.service._id).to.equal('testId')
					})
			})
			describe('existing service provided with service string', () => {
				it ('adds a service to the service store and returns added service', async () => {
					return rawService.addService({test: existingServiceId, service: 'existing-service' })
						.then((result: any) => {
							expect(result.service._id).to.equal('existingService')
						})
				})
			})
			describe('service added is external service', () => {
				it('adds a service to the service store and returns added service', async () => {
					return rawService.addService({test: externalServiceId, service: externalApp.service('method-test') })
						.then((result: any) => {
							expect(result.service._id).to.equal('methodTest')
						})
				})
				describe('external app provided with string service', () => {
					it ('adds a service to the service store and returns added service', async () => {
						return rawService.addService({
							test: externalAppId, 
							app: externalApp, 
							service: 'testing-app', 
							serviceOptions: { 
								id: 'externalAppId', 
								disableStringify: true 
							}})
							.then((result: any) => {
								expect(result.service._id).to.equal('externalAppId')
							})
					})
				})
			})
		})
		describe('getService', () => {
			it('returns a service from the service store', async () => {
				return rawService.getService(serviceId)
					.then((result: any) => {
						expect(result.test).to.equal(serviceId)
						expect(result.service._id).to.equal('testId')
					})
			})
		})
		describe('findService', () => {
			it('returns multiple services from the service store', async () => {
				return rawService.findService({}).then((result: any) => {
					expect(result.length).to.equal(4)
				})
			})
		})
		describe('removeService', () => {
			it('removes a service from the service store and returns removed service', async () => {
				return rawService.removeService(serviceId).then((result: any) => {
					expect(result.test).to.equal(serviceId)
					return rawService.getService(serviceId)
						.catch((error: any) => {
							expect(error.message).to.equal(`No record found for id '${serviceId}'`)
						})
				})
			})
		})
	})
})
