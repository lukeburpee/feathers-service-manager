import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import { v4 as uuid } from 'uuid'
import { default as Debug } from 'debug'
import { ServiceClass } from '../src/dat-base-service'

const debug = Debug('@feathers-service-manager:dat-sync:test')

describe('@feathers-service-manager:dat-sync', () => {
	const app = feathers()
	const serviceOptions = {
		connectionId: uuid(),
		client: 'client',
		events: ['testing']
	}
	describe('Base Service', () => {
		const rawService = new ServiceClass(serviceOptions)
		rawService.setup(app, '/dat-service')
		describe('Connection Methods', () => {
			describe('getConnectionType', () => {
				it(`returns the 'dat' connection type`, () => {
					expect(rawService.getConnectionType()).to.equal('dat')
				})
			})
			describe('getServiceType', () => {
				it(`returns the 'base-service' dat service type`, () => {
					expect(rawService.getServiceType()).to.equal('base-service')
				})
			})
			describe('healthCheck', () => {
				it(`returns the results of the dat server health check`, () => {
					return rawService.healthCheck().then((status: any) => {
						expect(status).to.equal('nan')
					})
				})
			})
			describe('getInfo', () => {
				it(`returns the results of the dat info check`, () => {
					return rawService.getInfo().then((info: any) => {
						expect(info).to.equal('nan')
					})
				})
			})
			describe('close', () => {
				it(`closes the gun client connection`, () => {
					return rawService.close().then((results: any) => {
						expect(results).to.equal('nan')
					})
				})
			})
		})
		// app.use('d-service', DockerService(serviceOptions))
		// const dService = app.service('d-service')
		// describe('Common Service Tests', () => {
		// base(app, errors, 'd-service', 'id')
		// })
	})
})
