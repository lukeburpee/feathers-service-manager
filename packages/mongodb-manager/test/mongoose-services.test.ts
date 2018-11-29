import { expect } from 'chai';
import feathers from '@feathersjs/feathers';
import * as errors from '@feathersjs/errors';
import configuration from '@feathersjs/configuration';
import { base } from 'feathers-service-tests';
import { connect } from 'mongoose';
import { _ } from '@feathersjs/commons';
import { v4 as uuid } from 'uuid'

import MongooseBaseService, { Service } from '../src/mongoose-base-service'


const debug = require('debug')('feathers-mongodb-manager:mongoose:test')

describe('feathers-mongodb-manager:mongoose', () => {
	let conn
	const app = feathers()
	const adminDb = {
		dbName: 'admin',
		useNewUrlParser: true,
      	poolSize: 10,
      	autoReconnect: true,
      	keepAlive: 300000
	}

	const connection = () => {
		return connect('mongodb://127.0.0.1:27017', adminDb).then(({connection}: any) => {
			conn = connection
			return connection
		}).catch(error => {
			throw new Error(`error connecting to mongodb: ${error.message}`)
		});
	}

	const client = connection()

	const serviceOptions = {
		events: ['testing'],
		client: client
	}
	describe('Base Service', () => {
		const rawBaseService = new Service(serviceOptions)
		rawBaseService.setup(app, '/mongoose-service')
		describe('Connection Methods', () => {
			describe('getConnectionType', () => {
				it(`returns the 'mongoose' connection type`, () => {
					expect(rawBaseService.getConnectionType()).to.equal('mongoose')
				})
			})
			describe('getServiceType', () => {
				it(`returns the 'base-service' service type`, () => {
					expect(rawBaseService.getServiceType()).to.equal('base-service')
				})
			})
			describe('healthCheck', () => {
				it(`returns the results of the mongoose client healthcheck`, () => {
					return rawBaseService.healthCheck().then((status: any) => {
						expect(status.ok).to.equal(1)
					})
				})
			})
			describe('getInfo', () => {
				it(`returns the results of the mongoose info check`, () => {
					return rawBaseService.getInfo().then((info: any) => {
						expect(info).to.have.property('version')
					})
				})
			})
		})
		//describe('Common Service Tests', () => {
		//	base(app, errors, 'mongoose', 'id')
		//})
	})
	after(() => {
		setTimeout(() => {
			conn.close()
		}, 3000)
	})
})
