import { ConfigServiceInterface } from './config.service.interface';
import { inject, injectable } from 'inversify';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { TYPES } from '../dependency.injection/types';
import { LoggerInterface } from '../logger/logger.interface';

@injectable()
export class ConfigService implements ConfigServiceInterface {
	private readonly config: DotenvParseOutput;

	constructor(@inject(TYPES.LoggerInterface) private logger: LoggerInterface) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.logger.error('Could not read .env file.');
			throw Error('Could not read .env file.');
		}
		this.config = result.parsed as DotenvParseOutput;
	}

	public get<T extends string>(key: string): T {
		return this.config[key] as T;
	}
}
