import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import { v4 as uuid } from 'uuid';
import { Client } from 'elasticsearch';
import { default as Debug } from 'debug'

import { ServiceClass } from '../src/elasticsearch-base-service'

const debug = Debug('@feathers-service-manager/elasticsearch-manager:test')

describe('@feathers-service-manager/elasticsearch-manager', () => {
	debug('elasticsearch-manager tests starting')
	const app = feathers()
	const connectionId = uuid()
	const client = new Client({
		host: 'localhost:9200'
	})
	const options = {
		client,
		connectionId,
		events: ['testing']
	}
	describe('Base Service', () => {
		const rawService = new ServiceClass(options)
		rawService.setup(app, '/elasticsearch-service')

		describe('Requiring', () => {
			it('exposes the Service Constructor', () => {
				expect(typeof ServiceClass).to.equal('function')
			})
		})
		describe('Connection Methods', () => {
			describe('getConnectionType', () => {
				it(`returns the 'elasticsearch' connection type`, () => {
					expect(rawService.getConnectionType()).to.equal('elasticsearch')
				})
			})
			describe('getServiceType', () => {
				it(`returns the 'base-service' elasticsearch service type`, () => {
					expect(rawService.getServiceType()).to.equal('base-service')
				})
			})
			describe('healthCheck', () => {
				it(`returns the results of the elasticsearch server health check`, () => {
					return rawService.healthCheck().then((status: any) => {
						expect(status).to.equal(true)
					})
				})
			})
			describe('getInfo', () => {
				it(`returns the results of the elasticsearch info check`, () => {
					return rawService.getInfo().then((info: any) => {
						expect(info).to.equal('nan')
					})
				})
			})
			describe('close', () => {
				it(`closes the elasticsearch client connection`, () => {
					return rawService.close().then((results: any) => {
						expect(results).to.equal('nan')
					})
				})
			})
		})
		// app.use('d-service', DockerService(options))
		// const dService = app.service('d-service')
		// describe('Common Service Tests', () => {
		// base(app, errors, 'd-service', 'id')
		// })
	})
})
