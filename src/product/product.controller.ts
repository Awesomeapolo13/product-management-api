import { BaseController } from '../common/http/base.controller';
import { IProductController } from './interface/product.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../common/dependency.injection/types';
import { ILogger } from '../common/logger/logger.interface';
import { IUserService } from '../user/interface/user.service.interface';

export class ProductController extends BaseController implements IProductController {
	constructor(
		@inject(TYPES.ILogger) protected logger: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/list',
				method: 'get',
				func: this.getListAction,
			},
		]);
	}
	getListAction(req: Request, res: Response, next: NextFunction): void {
		// ToDo: Получить продукты / Отфильтровать, если фильтры есть
	}

	createAction(req: Request, res: Response, next: NextFunction): void {
		// ToDo: Создать новый продукт
	}

	editAction(req: Request, res: Response, next: NextFunction): void {
		// ToDo: Изменить продукт
	}

	deleteAction(req: Request, res: Response, next: NextFunction): void {
		// ToDo: Удалить продукт
	}
}
