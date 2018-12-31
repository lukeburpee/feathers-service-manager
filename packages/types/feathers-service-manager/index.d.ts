interface ServiceOptions {
	id?: string;
	idField?: string;
	events?: any;
	paginate?: any;
	matcher?: any;
	sorter?: any;
	store?: any;
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
}