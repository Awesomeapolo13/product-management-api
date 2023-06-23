import { UserControllerInterface } from './user.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../common/dependency.injection/types';
import { LoggerInterface } from '../common/logger/logger.interface';
import { ConfigServiceInterface } from '../common/config/config.service.interface';
import { BaseController } from '../common/http/base.controller';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user.register.dto';
import { UserLoginDto } from './dto/user.login.dto';
import { HttpError } from '../common/error/http.error';

@injectable()
export class UserController extends BaseController implements UserControllerInterface {
	constructor(
		@inject(TYPES.LoggerInterface) protected logger: LoggerInterface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.UserService) private userService: UserService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.registerAction,
			},
			{
				path: '/login',
				method: 'post',
				func: this.loginAction,
			},
			{
				path: '/profile',
				method: 'get',
				func: this.getProfileAction,
			},
		]);
	}

	public async loginAction({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const dto = new UserLoginDto();
		dto.email = body.email;
		dto.password = body.password;
		try {
			const jwt = await this.userService.login(dto);
			this.ok(res, { success: true, jwt: jwt });
		} catch (e) {
			if (e instanceof HttpError) {
				return this.error(next, e.message, e.statusCode);
			}
			next(e);
		}
	}

	public async registerAction({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const dto = new UserRegisterDto();
		dto.name = body.name;
		dto.email = body.email;
		dto.password = body.password;
		try {
			const user = await this.userService.register(dto);
			this.ok(res, { success: true, user: { email: user?.email, id: user?.id } });
		} catch (e) {
			return next(e);
		}
	}

	public getProfileAction({ user, body }: Request, res: Response, next: NextFunction): void {
		try {
			const userResp = this.userService.getUserInfo(user);
			this.ok(res, { success: true, user: userResp });
		} catch (e) {
			return next(e);
		}
	}
}
