import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { MongoClient } from 'mongodb';
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'
import { default as Debug } from 'debug'

import { default as MemoryService } from '@feathers-service-manager/core-services'
import { default as RolesService, ServiceClass } from '../src/roles-service'

const debug = Debug('feathers-mongodb-manager:roles-service:test')

describe('feathers-mongodb-manager:roles-service', () => {
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

	describe('Requiring', () => {
		it('exposes the Service Constructor', () => {
			expect(typeof RolesService).to.equal('function')
		})
	})
	describe('Connection Methods', () => {
		const rawBaseService = new ServiceClass(options)
		rawBaseService.setup(app, '/roles-service')
		describe('getServiceType', () => {
			it(`returns the 'roles-service' mongodb service type`, () => {
				expect(rawBaseService.getServiceType()).to.equal('roles-service')
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