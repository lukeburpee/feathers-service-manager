/// <reference types="@feathers-service-manager/types/feathers-service-manager" />
import { Id, Params } from '@feathersjs/feathers';
import { ServiceClass as BaseServiceClass } from '@feathers-service-manager/base-service';
export default function init(options: ServiceOptions): ServiceClass;
export declare class ServiceClass extends BaseServiceClass {
    connections: any;
    connectionId: any;
    memberId: any;
    client: any;
    defaultOptions: any;
    constructor(options: ServiceOptions);
    setup(app: any, path: string): any;
    connect(options?: any, connections?: any): any;
    createConnection(id: Id, client: any, connections?: any): any;
    getConnection(connectionId: any): any;
    updateConnection(connectionId: any, data: any, params?: Params): any;
    patchConnection(connectionId: any, data: any, params?: Params): any;
    removeConnection(connectionId: any): any;
    getConnectionId(): any;
    getConnectionType(): string;
    getServiceType(): string;
    healthCheck(): any;
    getInfo(): any;
    getInstance(): any;
    private connectionServiceCheck;
}
//# sourceMappingURL=index.d.ts.map