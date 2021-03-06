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

import { default as MemoryService } from '@feathers-service-manager/core-services'
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

	app.use('connections', MemoryService({
		id: 'connectionId',
		events: ['testing'],
		disableStringify: true
	}))

	const connectionId = uuid()
	const client = MongoClient.connect('mongodb://127.0.0.1:27017', db)

	const options = {
		connectionService: app.service('connections'),
		events: ['testing'],
		client
	}

	const noClient = {
		connectionService: app.service('connections'),
		events: ['testing']
	}

	client.then((connection: any) => {
		conn = connection
	})

	describe('Requiring', () => {
		it('exposes the Service Constructor', () => {
			expect(typeof BaseService).to.equal('function')
		})
	})
	describe('Connecting', () => {
		const connectService = new ServiceClass(options)
		connectService.setup(app, '/connection-test')
		describe('connectionId does not exist in connection store', () => {
			it(`creates and attaches a default database`, () => {
				expect(connectService.default instanceof Db).to.be.true
			})
			it(`creates and attaches the admin database`, () => {
				expect(connectService.admin).to.have.property('buildInfo')
			})
			it(`adds the connection to the connection store`, () => {
				return app.service('connections').get(connectService.connectionId).then((connection: any) => {
					expect(connectService.memberId).to.equal(connection.members[0])
				})
			})
		})
		describe('connectionId exists in store', () => {
			let connection: any;
			let connectionService: any;
			let test: any;
			before(() => {
				return app.service('connections').create({
					connectionId,
					client,
					members: []
				})
				.then((connection: any) => {
					connectionService = new ServiceClass({
						connectionId,
						...noClient
					})
					connectionService.setup(app, '/existing-connection-test')
					return app.service('connections').get(connectionId)
					.then((testConnection: any) => {
						test = testConnection
						return test
					})
				})
			})
			it('attaches existing client connection to service', () => {
				expect(connectionService.client).to.equal(test.client)
			})
			it('creates and attaches a default database', () => {
				expect(connectionService.default instanceof Db).to.be.true
			})
			it('creates and attaches admin database', () => {
				expect(connectionService.admin).to.have.property('buildInfo')
			})
			it('patches the existing connection with service memberId', () => {
				expect(connectionService.memberId).to.equal(test.members[0])
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
		describe('close', () => {
			it('removes the connection from the connection store', () => {
				return rawBaseService.close().then((connection: any) => {
					app.service('connections').get(connection.connectionId)
					.catch((error: any) => {
						expect(error.message).to.equal(`No record found for id '${connection.connectionId}'`)
					})
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
