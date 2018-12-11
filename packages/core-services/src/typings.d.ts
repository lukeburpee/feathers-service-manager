declare module 'feathers-memory'
declare module 'feathers-service-tests'
declare module 'assert'
declare module 'redbird'
declare module 'selfsigned'

interface ServiceOptions {
	id?: any;
	idField?: any;
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
	disableStringify?: any;
	proxy?: any;
}

declare module '@feathersjs/commons' {
	import { Paginated, Params, Query } from '@feathersjs/feathers'
	export interface FeathersUnderscore {
		each (obj: any, callback: (arg0: any, arg1: any) => any): any,
		some (value: any, callback: (arg0: any, arg1: any) => any): any,
		every (value: any, callback: (arg0: any, arg1: any) => any): any,
		keys (obj: object): string[],
		values (obj: object): any[],
		isMatch (obj: any, item: any): boolean,
		isEmpty (obj: any): boolean,
		isObject (value: any): boolean,
		isObjectArray (value: any): boolean,
		extend (...args: any): object,
		omit (obj: object, ...keys: string[]): object,
		pick (source: object, ...keys: string[]): object,
		merge (target: object, source: object): object
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
	export function select (params?: Params, ...otherFields: any): any;
	export function isPromise (result: any): any;
	export function makeUrl (path: string, app: object): any;
	export function createSymbol (name: string): any;
	export function compareNSB (a: any, b: any): number;
	export function compareArrays (a: any, b: any): number;
	export function compare (a: any, b: any, compareStrings: (arg0: string, arg1: string) => number): any;
	export function sorter ($sort: object): (arg0: any, arg1: any) => number;
	export function filterQuery (query: Query, options?: object): any
}
