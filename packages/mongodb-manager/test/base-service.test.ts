import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { connect, MongoClient, Db, Admin } from 'mongodb';
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

	const options = {
		events: ['testing'],
		client: connection()
	}
	const withDefaultDb = {
		events: ['testing'],
		client: connection(),
		defaultDb: 'defaultDb'
	}
	describe('Requiring', () => {
		it('exposes the Service Constructor', () => {
			expect(typeof BaseService).to.equal('function')
		})
	})
	describe('Connecting', () => {

		const rawService = new ServiceClass(options)
		const rawServiceDefaultDb = new ServiceClass(withDefaultDb)

		rawService.setup(app, '/connection-test')
		rawServiceDefaultDb.setup(app, '/connection-test-w-default')

		describe('connectionId does not exist in connection store', () => {
			describe('default database', () => {
				describe('defaultDb not provided in options', () => {
					it(`uses the 'default' database as default`, () => {
						expect(rawService.default instanceof Db).to.be.true
						return rawService.default.stats().then((info: any) => {
							expect(info.db).to.equal('default')
						})
					})
				})
				describe('defaultDb provided in options', () => {
					it('uses the provided database as default', () => {
						expect(rawServiceDefaultDb.default instanceof Db).to.be.true
						return rawServiceDefaultDb.default.stats().then((info: any) => {
							expect(info.db).to.equal('defaultDb')
						})
					})
				})
			})
			it(`creates and attaches the admin database`, () => {
				expect(rawService.admin).to.have.property('buildInfo')
			})
			it(`adds the connection to the connection store`, () => {
				return app.service('connections').get(rawService.connectionId).then((connection: any) => {
					expect(rawService.memberId).to.equal(connection.members[0])
				})
			})
		})
	})
	describe('Connection Methods', () => {
		const rawBaseService = new ServiceClass(options)
		rawBaseService.setup(app, '/base-service')
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
	//app.use('m-service', MongoService(options))
	//const service = app.service('m-service')
	//describe('Common Service Tests', () => {
	//	base(app, errors, 'm-service', 'id')
	//})
	after(() => {
		setTimeout(() => {
			conn.close()
		}, 3000)
	})
})
