import { expect } from 'chai'
import * as express from 'express'
import got from 'got'
import feathers from '@feathersjs/feathers'
import { v4 as uuid } from 'uuid'
import { default as Debug } from 'debug'

import ProxyService from '../src/proxy-service'

const debug = Debug('feathers-service-manager:proxy-service:test')

describe('feathers-service-manager:proxy-service', () => {
	debug('proxy-service tests starting')
	let server;
	const options = {
		events: ['testing']
	}
	const id = uuid()
	const app = feathers()
	app.use('proxy', ProxyService(options))
	const proxy = app.service('proxy')
	// describe('Common Service Tests', () => {
	// base(app, errors, 'proxy')
	// })
	describe('Standard Service Methods', () => {
		before((done) => {
			server = express()
			server.get('/', (req, res) => {
				res.send('test')
			})
			server.get('/:id', (req, res) => {
				res.send(req.params.id)
			})
			server.listen(3000, () => {
				done()
			})
		})
		describe('create', () => {
			const port = 4000
			const register = [{src: 'localhost:5000', target: 'localhost:3000'}]
			it('creates and returns a proxy', () => {
				return proxy.create({
					id,
					port,
					register
				}).then((test: any) => {
					expect(test.id).to.equal(id)
					expect(test.port).to.have.property('register')
				})
			})
			it('registers proxy urls', () => {
				return got('localhost:5000').then((response: any) => {
					expect(response).to.equal('test')
				})
			})
			describe('missing port', () => {
				it('throws an error', () => {
					return proxy.create({id: uuid()})
						.catch((error: any) => {
							expect(error.message).to.equal('proxy service requires port')
						})
				})
			})
		})
	})
})
