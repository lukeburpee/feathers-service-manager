import { suit, test, slow, timeout } from 'mocha-typescript'
import { expect } from 'chai'
import feathers from '@feathersjs/feathers';
import { default as Debug } from 'debug'
import { ServiceClass as LogService } from '../src/log-service'

const debug = Debug('feathers-service-manager:log-service:test')

@suit class LogServiceSuite extends LogService {
	constructor(options: ServiceOptions) {
		super(options)
	}
	@test('create implementation')
	createImplementation(store: any, data: any, params?: any): any {
		expect(store).to.equal(this.store)
	}
}
