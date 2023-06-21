import { MiddlewareInterface } from '../middleware.interface';
import { Request, NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Role, UserModel } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

export class AuthMiddleware implements MiddlewareInterface {
	constructor(
		private readonly secret: string,
		private readonly noAuthRoutes: string[],
		private readonly prismaService: PrismaService,
	) {}
	public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (error, payload) => {
				if (error) {
					next();
				} else if (
					payload &&
					typeof payload !== 'string' &&
					!this.noAuthRoutes.includes(req.path)
				) {
					const authUser = this.findAuthUser(payload.email, payload.role);
					// ToDo Find user, check if route is allowed for unauth, record the user from DB.
					req.user = { email: payload.email, role: payload.role };
					next();
				}
			});
		}
		next();
	}

	/**
	 * Получает пользователя по email и роли.
	 */
	private async findAuthUser(email: string, role: Role): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
				role,
			},
		});
	}
}
