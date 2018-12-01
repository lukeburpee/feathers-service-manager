import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

import RedisService, { ServiceClass } from '../src/redis-base-service'

const debug = require('debug')('feathers-redis-manager:test')

describe('feathers-redis-manager', () => {
	const app = feathers()
	const serviceOptions = {
		connectionId: uuid(),
		client: 'client',
		events: ['testing']
	}
	describe('Base Service', () => {
		const rawService = new ServiceClass(serviceOptions)
		rawService.setup(app, '/redis-service')
		describe('Connection Methods', () => {
			describe('getConnectionType', () => {
				it(`returns the 'redis' connection type`, () => {
					expect(rawService.getConnectionType()).to.equal('redis')
				})
			})
			describe('getServiceType', () => {
				it(`returns the 'base-service' redis service type`, () => {
					expect(rawService.getServiceType()).to.equal('base-service')
				})
			})
			describe('healthCheck', () => {
				it(`returns the results of the redis server health check`, () => {
					return rawService.healthCheck().then((status: any) => {
						expect(status).to.equal('nan')
					})
				})
			})
			describe('getInfo', () => {
				it(`returns the results of the redis info check`, () => {
					return rawService.getInfo().then((info: any) => {
						expect(info).to.equal('nan')
					})
				})
			})
			describe('close', () => {
				it(`closes the redis client connection`, () => {
					return rawService.close().then((results: any) => {
						expect(results).to.equal('nan')
					})
				})
			})
		})
	})
})
