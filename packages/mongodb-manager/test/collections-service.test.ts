import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { connect } from 'mongodb';
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'
import { default as Debug } from 'debug'

import { default as CollectionsService, ServiceClass } from '../src/collections-service'

const debug = Debug('feathers-mongodb-manager:collections-service:test')

describe('feathers-mongodb-manager:collections-service', () => {
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
			expect(typeof CollectionsService).to.equal('function')
		})
	})
	describe('Connection Methods', () => {
		const rawBaseService = new ServiceClass(serviceOptions)
		rawBaseService.setup(app, '/base-service')
		describe('getServiceType', () => {
			it(`returns the 'collections-service' mongodb service type`, () => {
				expect(rawBaseService.getServiceType()).to.equal('collections-service')
			})
		})
	})
	//app.use('m-service', MongoService(serviceOptions))
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