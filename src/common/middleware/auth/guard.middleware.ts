import { IMiddleware } from '../middleware.interface';
import { Request, NextFunction, Response } from 'express';
import { HttpError } from '../../error/http.error';
import { HttpStatusCodeEnum } from '../../http/http.status.code.enum';

export class GuardMiddleware implements IMiddleware {
	constructor(private readonly role: string[]) {}
	public execute(req: Request, res: Response, next: NextFunction): void {
		if (this.role.length !== 0 && !this.role.includes(req.user.role)) {
			return next(
				new HttpError(
					HttpStatusCodeEnum.FORBIDDEN_CODE,
					'Недостаточно прав для выполнения операции',
					'FORBIDDEN',
				),
			);
		}

		next();
	}
}
