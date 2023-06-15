import { ILogObj, Logger } from 'tslog';

export interface LoggerInterface {
	logger: Logger<ILogObj>;
	log: (...args: unknown[]) => void;
	error: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
}
