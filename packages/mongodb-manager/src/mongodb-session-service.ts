import { Service as MongoDBBaseService } from './mongodb-base-service'

export default function (options: ServiceOptions) {
	return new Service(options)
}

export class Service extends MongoDBBaseService {
	constructor (options: ServiceOptions) {
		super(options)
	}
	public getServiceType (): any {
		return 'session-service'
	}
}
