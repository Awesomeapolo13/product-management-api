export interface ConfigServiceInterface {
	get: <T extends string>(key: string) => T;
}
