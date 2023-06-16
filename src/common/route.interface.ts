import { NextFunction, Request, Response, Router } from 'express';
import { MiddlewareInterface } from './middleware/middleware.interface';

export interface RouteInterface {
	path: string;
	method: keyof Pick<Router, 'get' | 'post' | 'patch' | 'put' | 'delete'>;
	func: ({ query, body }: Request<any, any, any, any>, res: Response, next: NextFunction) => void;
	middlewares?: MiddlewareInterface[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
