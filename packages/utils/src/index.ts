import { select } from '@feathersjs/commons'

export const _select = (...args: any[]) => {
    const base = select(...args);

    return function (result: any) {
    	if (args.includes('disableStringify')) {
    		return base(result)
    	}
    	const stringResults = JSON.stringify(result)

    	return base(JSON.parse(JSON.stringify(result)));
    }
}
