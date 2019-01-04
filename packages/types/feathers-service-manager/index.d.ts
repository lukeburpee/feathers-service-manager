interface ServiceOptions {
	id?: string;
	idField?: string;
	events?: any;
	paginate?: any;
	matcher?: any;
	sorter?: any;
	store?: any;
	storeIsService?: boolean;
	Model?: any;
	disableStringify?: boolean;
}

interface CertificateOptions extends ServiceOptions {
	defaultSettings?: any;
}

interface ConnectionOptions extends ServiceOptions {
	client?: any;
	connectionId?: string;
	connectionService?: any;
	databaseName?: string;
	defaultDb?: string;
	defaultOptions?: any;
}

interface MultiOptions extends ServiceOptions {
	multiOptions?: ServiceOptions;
	services?: any;
}

interface RegistryOptions extends MultiOptions {
	registryType?: any;
	versionate?: boolean;
	specKeys?: any;
}

interface JobOptions extends MultiOptions {
	registry?: any;
	taskRegistry?: any;
}

interface TaskOptions extends MultiOptions {
	registry?: any;
}

interface ManagerOptions extends MultiOptions {
	buildCount?: number;
	defaultCount?: number;
	proxyCount?: number;
	certificateOptions?: CertificateOptions;
	logOptions?: ServiceOptions;
	processOptions?: ServiceOptions;
	proxyOptions?: ServiceOptions;
	registryOptions?: ServiceOptions;
	manifestOptions?: ServiceOptions;
	clusterOptions?: ServiceOptions;
	defaultPkgTargets?: string;
}