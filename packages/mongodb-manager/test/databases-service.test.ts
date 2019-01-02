import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { MongoClient, Db } from 'mongodb';
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'
import { default as Debug } from 'debug'

import MemoryService from '@feathers-service-manager/base-service'
import { default as DatabasesService, ServiceClass } from '../src/databases-service'

const debug = Debug('feathers-mongodb-manager:databases-service:test')

describe('feathers-mongodb-manager:databases-service', () => {
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

	const client = MongoClient.connect('mongodb://127.0.0.1:27017', db)

	const options = {
		connectionService: app.service('connections'),
		events: ['testing'],
		client
	}

	client.then((connection: any) => {
		conn = connection
	})

	const rawBaseService = new ServiceClass(options)
	rawBaseService.setup(app, '/databases-service')

	describe('Requiring', () => {
		it('exposes the Service Constructor', () => {
			expect(typeof DatabasesService).to.equal('function')
		})
	})
	describe('Connection Methods', () => {
		describe('getServiceType', () => {
			it(`returns the 'databases-service' mongodb service type`, () => {
				expect(rawBaseService.getServiceType()).to.equal('databases-service')
			})
		})
	})
	describe('Standard Service Methods', () => {
		describe('create', () => {
			it(`creates a database and returns a mongodb database`, () => {
				return rawBaseService.create({ name: 'test' }).then((test: any) => {
					expect(test.name).to.equal('test')
					expect(test.db instanceof Db).to.be.true
					expect(test.stats).to.have.property('db')
				})
			})
			describe('missing database name', () => {
				it('throws an error', () => {
					return rawBaseService.create({}).catch((error: any) => {
						expect(error.message).to.equal('name required to create new mongodb database')
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