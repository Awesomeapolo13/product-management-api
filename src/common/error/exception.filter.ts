import { HttpError } from './http.error';
import { ErrorRespBodyInterface } from './error.resp.body.interface';
import { inject, injectable } from 'inversify';
import { ExceptionFilterInterface } from './exception.filter.interface';
import { Request, Response, NextFunction } from 'express';
import { LoggerInterface } from '../logger/logger.interface';
import { TYPES } from '../dependency.injection/types';

@injectable()
export class ExceptionFilter implements ExceptionFilterInterface {
	// С помощью декоратора устанавливаем инстанс логгера.
	constructor(@inject(TYPES.LoggerInterface) private logger: LoggerInterface) {}

	public catch(err: Error, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context}] Ошибка ${err.statusCode} : ${err.message}`);
			res.status(err.statusCode).send(this.getErrResponseBody(err.message));
		} else {
			this.logger.error(`${err.message}`);
			res.status(500).send(this.getErrResponseBody(err.message));
		}
	}

	private getErrResponseBody(message: string): ErrorRespBodyInterface {
		return {
			success: false,
			err: message,
		};
	}
}
