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

	setupApp.use('test', BaseService({ id: 'test', events: ['testing'], disableStringify: true }))

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
					const rawService = new ServiceClass(multiService)
					rawService.setup(setupApp, '/multi-service-test')
					it('uses the provided service as service storage', () => {
						expect(rawService.services._id).to.equal('test')
					})
				})
			})
		})
	})
	describe('custom methods', () => {
		const serviceId = uuid()
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
				return rawService.addService({ test: uuid(), service: 'testingTwo', serviceOptions: { id: 'testTwoId', disableStringify: true }})
					.then((service: any) => {
						return rawService.findService({}).then((result: any) => {
							expect(result.length).to.equal(2)
						})
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
