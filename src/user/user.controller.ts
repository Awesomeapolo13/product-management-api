import { UserControllerInterface } from './user.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../common/dependency.injection/types';
import { LoggerInterface } from '../common/logger/logger.interface';
import { ConfigServiceInterface } from '../common/config/config.service.interface';
import { BaseController } from '../common/http/base.controller';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user.register.dto';
import { BaseMsgEnum } from '../common/dictionary/base.msg.enum';

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
		]);
	}
	loginAction(req: Request, res: Response, next: NextFunction): void {
		// ToDo Realize login
	}

	public async registerAction({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const dto = new UserRegisterDto();
		dto.name = body.name;
		dto.email = body.email;
		dto.password = body.password;
		try {
			const user = await this.userService.register(dto);
			this.ok(res, { success: true, user: user?.email, id: user?.id });
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(e.message);
			}
			return this.error(next, BaseMsgEnum.DEFAULT_ERR_MGS, 400);
		}
	}
}
