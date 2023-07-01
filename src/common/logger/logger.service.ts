import { ILogger } from './logger.interface';
import { ILogObj, Logger } from 'tslog';
import { injectable } from 'inversify';

@injectable()
export class LoggerService implements ILogger {
	public logger: Logger<ILogObj>;

	constructor() {
		this.logger = new Logger();
	}

	public log(...args: unknown[]): void {
		this.logger.info(...args);
	}

	public error(...args: unknown[]): void {
		this.logger.error(...args);
	}

	public warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
