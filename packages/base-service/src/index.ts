import { Application, Id, Paginated, Params, ServiceMethods, SetupMethod } from '@feathersjs/feathers'
import { BadRequest, NotFound } from '@feathersjs/errors'
import { filterQuery, sorter, _ } from '@feathersjs/commons'
import { _select } from '@feathers-service-manager/utils'
import sift from 'sift'
import { v4 as uuid } from 'uuid'
import { default as Debug } from 'debug'

const debug = Debug('feathers-service-manager:core-services:base-service')

export default function init (options: ServiceOptions) {
  return new ServiceClass(options)
}

export class ServiceClass implements Partial<ServiceMethods<any>>, SetupMethod {
	public app!: any;
	public path!: any;
	public paginate!: Paginated<any>;
	public id!: any;
	public _id!: any;
	public store!: any;
	public storeIsService!: any;
	public Model!: any;
	public events!: any;
	public _matcher!: any;
	public _sorter!: any;
	public disableStringify!: any;
	public options!: any;
	constructor (options: ServiceOptions) {
		this.validateOptions(options)
		this.setOptions(options)
		debug('base-service initialized')
	}
	public setup (app: Application, path: string) {
		this.app = app
		this.path = path
	}
	protected validateOptions (options: any): boolean {
		if (!options) {
			throw new Error('service requires options')
		}
		return true
	}
	protected setOptions (options: any): boolean {
		this.options = options
		this.paginate = options.paginate ? options.paginate : {}
		this._id = this.id = options.idField || options.id || 'id'
		this.store = options.store || {}
		this.storeIsService = options.storeIsService || false
		this.Model = options.Model || {}
		this.events = options.events || []
		this._matcher = options.matcher
		this._sorter = options.sorter ? options.sorter : sorter
		this.disableStringify = options.disableStringify ? 'disableStringify' : null
		return true
	}
	protected generateId(): any {
		return uuid()
	}

	protected throwNotFound (id: Id): NotFound {
		throw new NotFound(`No record found for id '${id}'`)
	}

	protected async createImplementation (store: any, storeIsService: boolean, data: any, params?: Params): Promise<any> {
		if (storeIsService) {
			return store.create(data, params)
		}
		let id = data[this.id] || this.generateId();
		let current = _.extend({}, data, { [this.id]: id });
		return Promise.resolve((store[id] = current))
			.then(_select(params, this.id, this.disableStringify));
		}

	protected async getImplementation (store: any, storeIsService: boolean, id: Id, params?: Params): Promise<any> {
		if (storeIsService) {
			return store.get(id, params)
		}
		if (id in store) {
			return Promise.resolve(store[id])
				.then(_select(params, this.id, this.disableStringify));
		}
		return false
	}

	protected async findImplementation (store: any, storeIsService: boolean, params: Params | any, getFilter = filterQuery): Promise<any> {
		if (storeIsService) {
			return store.find(params)
		}
		const { query, filters } = this.processParams(params.query || {}, getFilter)
		const map = _select(params, this.disableStringify);
		return this.listImplementation(store)
			.then((items: any) => {
				const values = this.formatListValues(items)
				const { total, filteredValues } = this.filterListValues(query, filters, values)
				return {
					total,
					limit: filters.$limit || 0,
					skip: filters.$skip || 0,
					data: map(filteredValues)
				}
			})
	}

	protected async listImplementation (store: any): Promise<any> {
		return Promise.resolve(_.values(store))
	}

	protected async updateImplementation (store: any, storeIsService: boolean, id: Id, data: any, params?: Params): Promise<any> {
		if (storeIsService) {
			return store.update(id, data, params)
		}
		if (id in store) {
			// We don't want our id to change type if it can be coerced
			data = _.extend({}, data, { [this.id]: id });
			store[id] = data;
			return Promise.resolve(store[id])
				.then(_select(params, this.id, this.disableStringify));
		}
		return this.throwNotFound(id)
	}

	protected async patchImplementation (store: any, storeIsService: boolean, id: Id, data: any, params?: Params): Promise<any> {
		if (storeIsService) {
			return store.patch(id, data, params)
		}
		if (id in store) {
			_.extend(store[id], _.omit(data, this.id));
			return Promise.resolve(store[id])
				.then(_select(params, this.id, this.disableStringify));
		}
		return this.throwNotFound(id)
	}

	protected async removeImplementation (store: any, storeIsService: boolean, id: Id, params?: Params): Promise<any> {
		if (storeIsService) {
			return store.remove(id, params)
		}
		if (id in store) {
			return this.removeFromStore(store, id, params)
		}
		return this.throwNotFound(id)
	}

	protected async removeFromStore(store: any, id: Id, params?: Params): Promise<any> {
		const deleted = store[id]
		delete store[id]
		return Promise.resolve(deleted)
			.then(_select(params, this.id, this.disableStringify))
	}

	protected processParams (params?: any, getFilter = filterQuery): any {
		return getFilter(params)
	}

	protected formatListValues (values: any): any {
		return values
	}

	protected filterListValues (query: any, filters: any, values: any): any {
		if (this._matcher) {
			values = values.filter(this._matcher(query))
		}
		values = sift(query, values);
		const total = values.length;
		if (filters.$sort) {
			values.sort(this._sorter(filters.$sort));
		}
		if (filters.$skip) {
			values = values.slice(filters.$skip);
		}
		if (typeof filters.$limit !== 'undefined') {
			values = values.slice(0, filters.$limit);
		}
		return { total, filteredValues: values }
	}
	// Find without hooks and mixins that can be used internally and always returns
	// a pagination object
	protected async _find (params: Params | any, getFilter = filterQuery): Promise<any> {
		return this.findImplementation(this.store, this.storeIsService, params, getFilter)
	}

	public async find (params: Params | any): Promise<any> {
		const paginate = typeof params.paginate !== 'undefined' ? params.paginate : this.paginate
		// Call the internal find with query parameter that include pagination
		const result = this._find(params, (query: any) => filterQuery(query, { paginate }))
		if (!(paginate && paginate.default)) {
			return result.then((page: any) => page.data);
		}
		return result
	}

	public async get (id: Id, params?: Params): Promise<any> {
		const results = this.getImplementation(this.store, this.storeIsService, id, params)
		if (!results) {
			return this.throwNotFound(id)
		}
		return results
	}
	// Create without hooks and mixins that can be used internally
	protected async _create (data: any, params?: Params): Promise<any> {
		return this.createImplementation(this.store, this.storeIsService, data, params)
	}

	public async create (data: any, params?: Params): Promise<any> {
		if (Array.isArray(data)) {
			return Promise.all(data.map((current: any) => this._create(current)))
		}
		return this._create(data, params);
	}
	// Update without hooks and mixins that can be used internally
	protected async _update (id: Id, data: any, params: Params | undefined): Promise<any> {
		return this.updateImplementation(this.store, this.storeIsService, id, data, params)
	}

	public async update (id: Id, data: any, params?: Params): Promise<any> {
		if (id === null || Array.isArray(data)) {
			throw new BadRequest(`You can not replace multiple instances. Did you mean 'patch'?`)
		}
		return this._update(id, data, params)
	}
	// Patch without hooks and mixins that can be used internally
	protected async _patch (id: Id, data: any, params?: Params): Promise<any> {
		return this.patchImplementation(this.store, this.storeIsService, id, data, params)
	}

	public async patch (id: Id, data: any, params?: Params): Promise<any> {
		if (id === null) {
			return this._find(params).then(page => {
				return Promise.all(page.data.map(
					(current: any) => this._patch(current[this.id], data, params)))
			})
		}
		return this._patch(id, data, params);
	}
	// Remove without hooks and mixins that can be used internally
	protected async _remove (id: Id, params?: Params): Promise<any> {
		return this.removeImplementation(this.store, this.storeIsService, id, params)
	}

	public async remove (id: Id, params?: Params): Promise<any> {
		if (id === null) {
			return this._find(params).then((page: any) =>
			Promise.all(page.data.map((current: any) => this._remove(current[this.id], params))))
		}
		return this._remove(id, params);
	}
}
