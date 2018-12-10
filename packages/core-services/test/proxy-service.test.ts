import { expect, use } from 'chai'
import chaiHttp, { request } from 'chai-http'
import got from 'got'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import { v4 as uuid } from 'uuid'
import { default as Debug } from 'debug'

import ProxyService from '../src/proxy-service'

const debug = Debug('feathers-service-manager:proxy-service:test')

use(chaiHttp)

describe('feathers-service-manager:proxy-service', () => {
	debug('proxy-service tests starting')
	let id, app, service, proxy, test;
	const options = {
		events: ['testing'],
		disableStringify: true
	}
	describe('Standard Service Methods', () => {
		before(() => {
			id = uuid()
			app = express(feathers())
			app.use('proxy', ProxyService(options))
			service = app.service('proxied-service')
			proxy = app.service('proxy')
		})
		after(() => {
			return proxy.remove(null, {})
		})
		describe('create', () => {
			it('creates and returns a proxy', () => {
				return proxy.create({
					id,
					port: 3000,
					register: [{src: 'localhost:4000', target: 'localhost:5000'}]
				}).then((test: any) => {
					expect(test.proxy).to.have.property('register')
				})
			})
		})
		describe('get', () => {
			it('returns a proxy by id', () => {
				return proxy.get(id).then((test: any) => {
					expect(test.proxy).to.have.property('register')
				})
			})
		})
		describe('patch', () => {
			it('adds new routes to the proxy through register option', () => {
				return proxy.patch(id, {
					register: [
						{src: 'localhost:5000', target: 'localhost:6000'},
						{src: 'localhost:6000', target: 'localhost:7000'}
					]
				}).then((test: any) => {
					expect(test.proxy).to.have.property('register')
				})
			})
			it('removes routes from the proxy through unregister option', () => {
				return proxy.patch(id, {
					unregister: [{src: 'localhost:5000', target: 'localhost:6000'}]
				}).then((test: any) => {
					expect(test.proxy).to.have.property('register')
				})
			})
			it('allows simultaneous register and unregister options', () => {
				return proxy.patch(id, {
					register: [{src: 'localhost:5000', target: 'localhost:6000'}],
					unregister: [{src: 'localhost:6000', target: 'localhost:7000'}]
				}).then((test: any) => {
					expect(test.proxy).to.have.property('register')
				})
			})
			describe('id not in storage', () => {
				it ('throws an error', () => {
					const errorId = uuid()
					return proxy.patch(errorId, {
						register: [{src: 'localhost:5000', target: 'localhost:6000'}]
					}).catch((error: any) => {
						expect(error.message).to.equal(`No record found for id '${errorId}'`)
					})
				})
			})
		})
		describe('remove', () => {
			it('closes and removes proxy by id', () => {
				return proxy.create({
					port: 9000 
				}).then((result: any) => {
					return proxy.remove(result.id)
						.then((test: any) => {
							expect(test.proxy).to.have.property('register')
						})
				})
			})
			describe('id not in storage', () => {
				it ('throws an error', () => {
					const errorId = uuid()
					return proxy.remove(errorId)
						.catch((error: any) => {
							expect(error.message).to.equal(`No record found for id '${errorId}'`)
						})
				})
			})
		})
	})
})
