import { Router } from 'express';
import { LoggerInterface } from './logger/logger.interface';
import { RouteInterface } from './route.interface';
import { injectable } from 'inversify';

@injectable()
export abstract class BaseController {
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
}
