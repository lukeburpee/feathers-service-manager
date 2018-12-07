declare module 'uberproto'
declare module 'feathers-memory'
declare module 'feathers-service-tests'
declare module 'assert'

interface ServiceOptions {
  id?: any;
  events?: any;
  client?: any;
  connectionId?: any;
  connectionService?: any;
  databaseName?: any;
  defaultOptions?: any;
  defaultDb?: any;
  paginate?: any;
  matcher?: any;
  sorter?: any;
  store?: any;
  Model?: any;
}

declare module '@feathersjs/commons' {
	import { Paginated } from '@feathersjs/feathers'
	export interface FeathersUnderscore {
		each (obj: any, callback: Function): any,
		some (value: any, callback: Function): any,
		every (value: any, callback: Function): any,
		keys (obj: any): any,
		values (obj: any): any,
		isMatch (obj: any, item: any): any,
		isEmpty (obj: any): any,
		isObject (value: any): any,
		isObjectArray (value: any): any,
		extend (...args: any): any,
		omit (obj: any, ...keys: any): any,
		pick (source: any, ...keys: any): any,
		merge (target: any, source: any): any
	}
	export interface HookUtils {
		SKIP: any;
		ACTIVATE_HOOKS: any; 
		createHookObject (method: any, data: object): any;
		defaultMakeArguments (hook: any): any;
		makeArguments (hook: any): any;
		convertHookData (obj: any): any;
		isHookObject (hookObject: any): any;
		getHooks (app: any, service: any, type: any, method: any, appLast: any): any;
		processHooks (hooks: any, initialHookObject: any): any;
		enableHooks (obj: any, methods: any, types: any): any;
	}
	export const hooks: HookUtils;
	export const _: FeathersUnderscore;
	export function stripSlashes (name: string): string;
	export function select (params?: any, ...otherFields: any): any;
	export function isPromise (result: any): any;
	export function makeUrl (path: string, app: object): any;
	export function createSymbol (name: string): any;
	export function compareNSB (a: any, b: any): any;
	export function compareArrays (a: any, b: any): any;
	export function compare (a: any, b: any, compareStrings: Function): any;
	export function sorter ($sort: any): any;
	export function filterQuery (query: any, options?: object): any
}