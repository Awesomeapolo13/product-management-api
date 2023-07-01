import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from '../middleware/middleware.interface';

export interface RouteInterface {
	path: string;
	method: keyof Pick<Router, 'get' | 'post' | 'patch' | 'put' | 'delete'>;
	func: ({ query, body }: Request<any, any, any, any>, res: Response, next: NextFunction) => void;
	middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
