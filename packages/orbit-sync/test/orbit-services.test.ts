import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import { v4 as uuid } from 'uuid'
import { default as Debug } from 'debug'
import { ServiceClass } from '../src/orbit-base-service'

const debug = Debug('@feathers-service-manager:orbit-sync:test')

describe('@feathers-service-manager:orbit-sync', () => {
	const app = feathers()
	const serviceOptions = {
		connectionId: uuid(),
		client: 'client',
		events: ['testing']
	}
	describe('Base Service', () => {
		const rawService = new ServiceClass(serviceOptions)
		rawService.setup(app, '/orbit-service')
		describe('Connection Methods', () => {
			describe('getConnectionType', () => {
				it(`returns the 'orbit' connection type`, () => {
					expect(rawService.getConnectionType()).to.equal('orbit')
				})
			})
			describe('getServiceType', () => {
				it(`returns the 'base-service' orbit service type`, () => {
					expect(rawService.getServiceType()).to.equal('base-service')
				})
			})
			describe('healthCheck', () => {
				it(`returns the results of the orbit server health check`, () => {
					return rawService.healthCheck().then((status: any) => {
						expect(status).to.equal('nan')
					})
				})
			})
			describe('getInfo', () => {
				it(`returns the results of the orbit info check`, () => {
					return rawService.getInfo().then((info: any) => {
						expect(info).to.equal('nan')
					})
				})
			})
			describe('close', () => {
				it(`closes the orbit client connection`, () => {
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
