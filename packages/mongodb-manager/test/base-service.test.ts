import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { connect } from 'mongodb';
import { connect as mongooseConnect } from 'mongoose'
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'
import { default as Debug } from 'debug'

import BaseService, { ServiceClass } from '../src/base-service'

const debug = Debug('feathers-mongodb-manager:base-service:test')

describe('feathers-mongodb-manager:base-service', () => {
	let conn: any;
	const app = feathers()
	const db = {
		useNewUrlParser: true,
		poolSize: 10,
		autoReconnect: true,
		keepAlive: true
	}

	const connection = () => {
		return connect('mongodb://127.0.0.1:27017', db).then((connection: any) => {
			conn = connection
			return connection
		}).catch(error => {
			debug(`error connecting to mongodb: ${error.message}`)
		});
	}

	const serviceOptions = {
		events: ['testing'],
		client: connection(),
		defaultDb: 'test'
	}
	describe('Requiring', () => {
		it('exposes the Service Constructor', () => {
			expect(typeof ServiceClass).to.equal('function')
		})
	})
	describe('Base Service', () => {
		const rawBaseService = new ServiceClass(serviceOptions)
		rawBaseService.setup(app, '/base-service')
		describe('Connection Methods', () => {
			describe('getConnectionType', () => {
				it(`returns the 'mongodb' connection type`, () => {
					expect(rawBaseService.getConnectionType()).to.equal('mongodb')
				})
			})
			describe('getServiceType', () => {
				it(`returns the 'base-service' mongodb service type`, () => {
					expect(rawBaseService.getServiceType()).to.equal('base-service')
				})
			})
			describe('healthCheck', () => {
				it(`returns the results of the mongodb client healthcheck`, () => {
					return rawBaseService.healthCheck().then((status: any) => {
						expect(status.ok).to.equal(1)
					})
				})
			})
			describe('getInfo', () => {
				it(`returns the results of the mongodb info check`, () => {
					return rawBaseService.getInfo().then((info: any) => {
						expect(info).to.have.property('version')
					})
				})
			})
		})
		//app.use('m-service', MongoService(serviceOptions))
		//const service = app.service('m-service')
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'm-service', 'id')
		//})
	})
	after(() => {
		setTimeout(() => {
			conn.close()
		}, 3000)
	})
})
