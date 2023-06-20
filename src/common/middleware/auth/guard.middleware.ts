import { MiddlewareInterface } from '../middleware.interface';
import { Request, NextFunction, Response } from 'express';
import { Role } from '@prisma/client';

export class GuardMiddleware implements MiddlewareInterface {
	constructor(private readonly role: Role) {}
	execute(req: Request, res: Response, next: NextFunction): void {
		// ToDo: Realize a Role checking;
	}
}
