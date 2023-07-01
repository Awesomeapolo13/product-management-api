import { IMiddleware } from '../middleware.interface';
import { Request, NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserModel } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { HttpError } from '../../error/http.error';
import { HttpStatusCodeEnum } from '../../http/http.status.code.enum';
import { AuthMsgEnum } from './auth.msg.enum';
import { ExceptionContextEnum } from '../../error/exception.context.enum';

export class AuthMiddleware implements IMiddleware {
	constructor(
		private readonly secret: string,
		private readonly noAuthRoutes: string[],
		private readonly prismaService: PrismaService,
	) {}
	public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		if (await this.isUnauthRoute(req.path)) {
			next();
		} else if (req.headers.authorization) {
			await this.handleAuth(req.headers.authorization, req, next);
		} else {
			next(await this.getUnauthError());
		}
	}

	private async isUnauthRoute(path: string): Promise<boolean> {
		return this.noAuthRoutes.includes(path);
	}

	private async handleAuth(token: string, req: Request, next: NextFunction): Promise<void> {
		verify(token.split(' ')[1], this.secret, async (error, payload) => {
			if (error) {
				return next(await this.getUnauthError());
			} else if (payload && typeof payload !== 'string') {
				const authUser = await this.findAuthUser(payload.email);
				if (!authUser) {
					return next(await this.getUnauthError());
				}
				req.user = authUser;
				return next();
			}
		});
	}

	private async getUnauthError(): Promise<HttpError> {
		return new HttpError(
			HttpStatusCodeEnum.UNAUTHORIZED_CODE,
			AuthMsgEnum.UNAUTH_MSG,
			ExceptionContextEnum.AUTH_CONTEXT,
		);
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
