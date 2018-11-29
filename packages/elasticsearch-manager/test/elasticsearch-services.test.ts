import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

import ElasticsearchService, { Service } from '../src/elasticsearch-base-service'

const debug = require('debug')('feathers-elasticsearch-manager:test')

describe('feathers-elasticsearch-manager', () => {
	let testSwarm, testConfig, testContainer
	const serviceOptions = {
		connectionId: uuid(),
		client: 'client',
		events: ['testing']
	}
	const serviceOptionsConnectionId = {
		client: serviceOptions.connectionId,
		events: ['testing']
	}
	const app = feathers()
	describe('Base Service', () => {
		const rawService = new Service(serviceOptions)
		rawService.setup(app, '/elasticsearch-service')
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
						expect(status).to.equal('nan')
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
		//app.use('d-service', DockerService(serviceOptions))
		//const dService = app.service('d-service')
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'd-service', 'id')
		//})
	})
})
