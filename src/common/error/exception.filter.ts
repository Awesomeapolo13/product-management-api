import { HttpError } from './http.error';
import { IErrorRespBody } from './error.resp.body.interface';
import { inject, injectable } from 'inversify';
import { IExceptionFilter } from './exception.filter.interface';
import { Request, Response, NextFunction } from 'express';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../dependency.injection/types';
import { HttpStatusCodeEnum } from '../http/http.status.code.enum';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	// С помощью декоратора устанавливаем инстанс логгера.
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}

	public catch(err: Error, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context}] Ошибка ${err.statusCode} : ${err.message}`);
			res.status(err.statusCode).send(this.getErrResponseBody(err.message));
		} else {
			this.logger.error(`${err.message}`);
			res
				.status(HttpStatusCodeEnum.SERVER_EXCEPTION_CODE)
				.send(this.getErrResponseBody(err.message));
		}
	}

	private getErrResponseBody(message: string): IErrorRespBody {
		return {
			success: false,
			err: message,
		};
	}
}
