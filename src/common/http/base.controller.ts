import { Router, NextFunction, Response } from 'express';
import { LoggerInterface } from '../logger/logger.interface';
import { ExpressReturnType, RouteInterface } from './route.interface';
import { injectable } from 'inversify';
import { HttpError } from '../error/http.error';
import { HttpStatusCodeEnum } from './http.status.code.enum';

@injectable()
export abstract class BaseController {
	private static readonly DEFAULT_HTTP_MSG = 'Something went wrong. Try to repeat later...';

	private readonly _router: Router;

	constructor(protected logger: LoggerInterface) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	protected bindRoutes(routes: RouteInterface[]): void {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			// Сохраняем контекст контроллера для передачи его в функцию ниже.
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}

	public send<T>(res: Response, code: number, responseBody: T): ExpressReturnType {
		res.type('application/json');

		return res.status(code).json(responseBody);
	}

	public ok<T>(res: Response, responseBody: T): ExpressReturnType {
		return this.send<T>(res, HttpStatusCodeEnum.OK_CODE, responseBody);
	}

	public error(next: NextFunction, message?: string, code?: number): void {
		const error = new HttpError(
			code ?? HttpStatusCodeEnum.SERVER_EXCEPTION_CODE,
			message ?? BaseController.DEFAULT_HTTP_MSG,
		);

		return next(error);
	}
}
