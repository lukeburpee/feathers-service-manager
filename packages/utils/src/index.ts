import { select } from '@feathersjs/commons'

export const _select = (...args: any[]) => {
    const base = select(...args);

    return function (result: any) {
      const stringResults = JSON.stringify(result)

      return base(JSON.parse(JSON.stringify(result)));
    }
 }
