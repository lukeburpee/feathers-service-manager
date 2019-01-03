import { Service, ServiceOverloads, ServiceAddons, ServiceMethods } from '@feathersjs/feathers'
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

export const serviceCheck = (service: any): service is Service<any> => {
	return (<Service<Partial<ServiceOverloads<any>> & Partial<ServiceAddons<any>> & Partial<ServiceMethods<any>>>>service).hooks !== undefined;
}

import readJson from 'load-json-file'
import writeJson from 'write-json-file'

export {
	readJson,
	writeJson
}

import { directory as tmpDir, file as tmpFile } from 'tempy'

export {
	tmpDir,
	tmpFile
}

import pAll from 'p-all'
import pCancelable from 'p-cancelable'
import pEvent from 'p-event'
import pFilter from 'p-filter'
import pForever from 'p-forever'
import pMap from 'p-map'
import pPipe from 'p-pipe'
import pProgress from 'p-progress'
import pQueue from 'p-queue'
import pReduce from 'p-reduce'
import pRetry from 'p-retry'
import pSeries from 'p-series'
import pThrottle from 'p-throttle'
import pTime from 'p-time'

export {
	pAll,
	pCancelable,
	pEvent,
	pFilter,
	pForever,
	pMap,
	pPipe,
	pProgress,
	pQueue,
	pRetry,
	pSeries,
	pThrottle,
	pTime
}