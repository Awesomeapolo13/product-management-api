import { MiddlewareInterface } from '../middleware.interface';
import { Request, NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware implements MiddlewareInterface {
	constructor(private readonly secret: string) {}
	public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (error, payload) => {
				if (error) {
					next();
				} else if (payload && typeof payload !== 'string') {
					// ToDo Find user, check if route is allowed for unauth, record the user from DB.
					req.user = { email: payload.email, role: payload.role };
					next();
				}
			});
		}
		next();
	}
}
