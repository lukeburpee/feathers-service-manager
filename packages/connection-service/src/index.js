"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const base_service_1 = __importStar(require("@feathers-service-manager/base-service"));
const debug = debug_1.default('feathers-service-manager:core-services:connection-service');
function init(options) {
    return new ServiceClass(options);
}
exports.default = init;
class ServiceClass extends base_service_1.ServiceClass {
    constructor(options) {
        super(options);
        if (!options.client && !options.connectionId) {
            throw new Error(`${this.getConnectionType()} client or connectionId must be provided`);
        }
        this.client = options.client;
        this.connectionId = options.connectionId || this.generateId();
        this.memberId = this.generateId();
        this.defaultOptions = options.defaultOptions || {};
        debug('connection-service initialized');
    }
    setup(app, path) {
        super.setup(app, path);
        this.connectionServiceCheck(app).then((connections) => {
            this.connect(this.options, connections);
        });
    }
    connect(options, connections) {
        this.options = options;
        return this.createConnection(this.connectionId, this.client, connections);
    }
    createConnection(id, client, connections) {
        const service = connections || this.connections;
        return this.getInfo().then(((info) => {
            const connection = {
                [service._id]: id,
                info,
                client,
                connectionType: this.getConnectionType(),
                serviceTypes: [this.getServiceType()],
                status: 'pending',
                members: [this.memberId]
            };
            return service.create(connection);
        }))
            .then((result) => {
            debug(`${this.getConnectionType()} connection created: ${this.connectionId}`);
            return result;
        });
    }
    getConnection(connectionId) {
        return this.connections.get(connectionId);
    }
    updateConnection(connectionId, data, params) {
        return this.connections.update(connectionId, data, params);
    }
    patchConnection(connectionId, data, params) {
        return this.connections.patch(connectionId, data, params);
    }
    removeConnection(connectionId) {
        return this.connections.remove(connectionId);
    }
    getConnectionId() {
        return this.connectionId;
    }
    getConnectionType() {
        return 'connection-base';
    }
    getServiceType() {
        return 'connection-service';
    }
    healthCheck() {
        return new Promise((resolve) => {
            resolve('nan');
        }).then((results) => {
            return results;
        });
    }
    getInfo() {
        return new Promise((resolve) => {
            resolve('nan');
        }).then((results) => {
            return results;
        });
    }
    getInstance() {
        return new Promise((resolve) => {
            resolve('nan');
        }).then((results) => {
            return results;
        });
    }
    connectionServiceCheck(app) {
        return new Promise(resolve => {
            if (this.options.connectionService) {
                if (typeof this.options.connectionService === 'string') {
                    if (typeof app.service(this.options.connectionService) === 'undefined') {
                        debug(`no service ${this.options.connectionService} found on application setup. 
							${this.getConnectionType()} service will create ${this.options.connectionService} service.`);
                        app.use(this.options.connectionService, base_service_1.default({ id: `${this.options.connectionService}Id` }));
                    }
                    this.connections = app.service(this.options.connectionService);
                    return resolve(this.connections);
                }
                debug(`using provided connection service as internal service`);
                this.connections = this.options.connectionService;
                return resolve(this.connections);
            }
            if (typeof app.service('connection') === 'undefined') {
                debug(`no connection service found on application setup. ${this.getConnectionType()} service will create connection service.`);
                app.use('connections', base_service_1.default({ id: 'connectionId' }));
            }
            this.connections = app.service('connections');
            return resolve(this.connections);
        });
    }
}
exports.ServiceClass = ServiceClass;
//# sourceMappingURL=index.js.map