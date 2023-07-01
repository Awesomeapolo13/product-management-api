import { IUserController } from './interface/user.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../common/dependency.injection/types';
import { ILogger } from '../common/logger/logger.interface';
import { BaseController } from '../common/http/base.controller';
import { UserRegisterDto } from './dto/user.register.dto';
import { UserLoginDto } from './dto/user.login.dto';
import { HttpError } from '../common/error/http.error';
import { ValidateMiddleware } from '../common/middleware/validate.middleware';
import { IUserService } from './interface/user.service.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) protected logger: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.registerAction,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.loginAction,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/profile',
				method: 'get',
				func: this.getProfileAction,
			},
		]);
	}

	public async loginAction(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const jwt = await this.userService.login(body);
			this.ok(res, { success: true, jwt });
		} catch (e) {
			if (e instanceof HttpError) {
				return this.error(next, e.message, e.statusCode);
			}
			next(e);
		}
	}

	public async registerAction(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const user = await this.userService.register(body);
			this.ok(res, { success: true, user: { email: user?.email, id: user?.id } });
		} catch (e) {
			return next(e);
		}
	}

	public getProfileAction({ user }: Request, res: Response, next: NextFunction): void {
		try {
			const userResp = this.userService.getUserInfo(user);
			this.ok(res, { success: true, user: userResp });
		} catch (e) {
			return next(e);
		}
	}
}
