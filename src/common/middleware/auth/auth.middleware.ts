import { IMiddleware } from '../middleware.interface';
import { Request, NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserModel } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { HttpError } from '../../error/http.error';
import { HttpStatusCodeEnum } from '../../http/http.status.code.enum';

export class AuthMiddleware implements IMiddleware {
	constructor(
		private readonly secret: string,
		private readonly noAuthRoutes: string[],
		private readonly prismaService: PrismaService,
	) {}
	public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (this.noAuthRoutes.includes(req.path)) {
			next();
		} else if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, async (error, payload) => {
				if (error) {
					next(new HttpError(HttpStatusCodeEnum.UNAUTHORIZED_CODE, 'Вы не авторизованы.'));
				} else if (
					payload &&
					typeof payload !== 'string' &&
					!this.noAuthRoutes.includes(req.path)
				) {
					const authUser = await this.findAuthUser(payload.email);
					if (authUser) {
						next(
							new HttpError(
								HttpStatusCodeEnum.UNAUTHORIZED_CODE,
								'Вы не авторизованы.',
								'AUTHORIZATION',
							),
						);
					}
					req.user = authUser;
					next();
				}
			});
		} else {
			next(
				new HttpError(HttpStatusCodeEnum.UNAUTHORIZED_CODE, 'Вы не авторизованы.', 'AUTHORIZATION'),
			);
		}
	}

	/**
	 * Получает пользователя по email и роли.
	 */
	private async findAuthUser(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
