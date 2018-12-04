import { select } from '@feathersjs/commons'

export const _select = (...args: any[]) => {
	const base = select(...args)

	return function (result: any) {
		return base(JSON.parse(JSON.stringify(result)))
	}
}
