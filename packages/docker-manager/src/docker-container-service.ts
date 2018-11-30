import { Application, Id, NullableId, Paginated, Params, ServiceMethods, SetupMethod } from '@feathersjs/feathers'
import errors from '@feathersjs/errors'
import { _ } from '@feathersjs/commons'
import { _select } from '@feathers-service-manager/utils'

import { ServiceClass as DockerBaseService } from './docker-base-service'

export default function (options: ServiceOptions) {
  return new Service(options)
}

const actions: any = {
  INSPECT: 'inspect',
  RENAME: 'rename',
  UPDATE: 'update',
  TOP: 'top',
  CHECK_CHANGES: 'check-changes',
  EXPORT: 'export',
  START: 'start',
  STOP: 'stop',
  PAUSE: 'pause',
  UNPAUSE: 'unpause',
  COMMIT: 'commit',
  RESTART: 'restart',
  KILL: 'kill',
  RESIZE: 'resize',
  ATTACH: 'attach',
  WAIT: 'wait',
  REMOVE: 'remove',
  GET_ARCHIVE: 'get-archive',
  INFO_ARCHIVE: 'info-archive',
  PUT_ARCHIVE: 'put-archive',
  LOGS: 'logs',
  STATS: 'stats'
}

export class Service extends DockerBaseService {
  constructor (private options: ServiceOptions) {
    super(options)
  }
  public getServiceType(): any {
  	return 'container-service'
  }
  public createContainer (data: any): any {
  	return this.client.createContainer(data)
  }
  public getContainer (id: Id): any {
    return Promise.resolve(this.client.getContainer(id))
  }
  public listContainers (data: any): any {
    return Promise.resolve(this.client.listContainers(data))
  }
  public pruneContainers (data: any): any {
    return Promise.resolve(this.client.pruneContainers(data))
  }
  public executeAction (container: any, type: string, options: any): any {
    switch (type) {
      case actions.INSPECT:
        return Promise.resolve(container.inspect(options))
      case actions.RENAME:
        return Promise.resolve(container.rename(options))
      case actions.UPDATE:
        return Promise.resolve(container.update(options))
      case actions.TOP:
        return Promise.resolve(container.top(options))
      case actions.CHECK_CHANGES: 
        return Promise.resolve(container.changes())
      case actions.EXPORT:
        return Promise.resolve(container.export())
      case actions.START:
        return Promise.resolve(container.start(options))
      case actions.STOP:
        return Promise.resolve(container.stop(options))
      case actions.PAUSE:
        return Promise.resolve(container.pause(options))
      case actions.UNPAUSE:
        return Promise.resolve(container.unpause(options))
      case actions.COMMIT:
        return Promise.resolve(container.commit(options))
      case actions.RESTART:
        return Promise.resolve(container.restart(options))
      case actions.KILL:
        return Promise.resolve(container.kill(options))
      case actions.RESIZE:
        return Promise.resolve(container.resize(options))
      case actions.ATTACH:
        return Promise.resolve(container.attach(options))
      case actions.WAIT:
        return Promise.resolve(container.wait(options))
      case actions.REMOVE:
        return Promise.resolve(container.remove(options))
      case actions.GET_ARCHIVE:
        return Promise.resolve(container.getArchive(options))
      case actions.INFO_ARCHIVE:
        return Promise.resolve(container.infoArchive(options))
      case actions.PUT_ARCHIVE:
        return Promise.resolve(container.putArchive(options))
      case actions.LOGS:
        return Promise.resolve(container.logs(options))
      case actions.STATS:
        return Promise.resolve(container.stats(options))
      default: 
        return Promise.resolve(container.exec(options))
    }
  }
}
