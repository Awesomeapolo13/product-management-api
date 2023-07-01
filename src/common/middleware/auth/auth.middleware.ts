import { IMiddleware } from '../middleware.interface';
import { Request, NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserModel } from '@prisma/client';
import { HttpError } from '../../error/http.error';
import { HttpStatusCodeEnum } from '../../http/http.status.code.enum';
import { AuthMsgEnum } from './auth.msg.enum';
import { ExceptionContextEnum } from '../../error/exception.context.enum';
import { secureConfig } from './secure.config';
import { IConfigService } from '../../config/config.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../dependency.injection/types';
import { IUserRepository } from '../../../user/interface/user.repository.interface';

@injectable()
export class AuthMiddleware implements IMiddleware {
	constructor(
		@inject(TYPES.ConfigService) private readonly configService: IConfigService,
		@inject(TYPES.UserRepository) private readonly userRepo: IUserRepository,
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
		return secureConfig.noAuthRoutes.includes(path);
	}

	private async handleAuth(token: string, req: Request, next: NextFunction): Promise<void> {
		verify(token.split(' ')[1], this.configService.get('SECRET'), async (error, payload) => {
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
		return this.userRepo.find(email);
	}
}
