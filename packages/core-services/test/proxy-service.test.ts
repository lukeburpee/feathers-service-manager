import { expect, use } from 'chai'
import chaiHttp, { request } from 'chai-http'
import got from 'got'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import { v4 as uuid } from 'uuid'
import { default as Debug } from 'debug'

import MemoryService from '../src/base-service'
import ProxyService from '../src/proxy-service'

const debug = Debug('feathers-service-manager:proxy-service:test')

use(chaiHttp)

describe('feathers-service-manager:proxy-service', () => {
	debug('proxy-service tests starting')
	let id, app, proxy;
	const options = {
		events: ['testing'],
		disableStringify: true
	}
	before(() => {
		id = uuid()
		app = feathers()
		app.use('proxy', ProxyService(options))
		proxy = app.service('proxy')
	})
	after(() => {
		return proxy.find({}).then((results: any) => {
			const ids = results.map((item: any) => item.id)
			return proxy.remove(ids)
		})
	})
	describe('Standard Service Methods', () => {
		describe('create', () => {
			const port = 3000
			it('creates and returns a proxy', () => {
				return proxy.create({
					id,
					port
				}).then((test: any) => {
					expect(test).to.have.property('proxy')
				})
			})
		})
	})
})
