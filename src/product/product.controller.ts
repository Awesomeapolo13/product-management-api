import { BaseController } from '../common/http/base.controller';
import { IProductController } from './interface/product.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../common/dependency.injection/types';
import { ILogger } from '../common/logger/logger.interface';
import { ProdFilterDto } from './dto/prod.filter.dto';
import { IProductService } from './interface/product.service.interface';

export class ProductController extends BaseController implements IProductController {
	constructor(
		@inject(TYPES.ILogger) protected logger: ILogger,
		@inject(TYPES.ProductService) private userService: IProductService,
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
	public async getListAction(
		{ query, body }: Request<{}, {}, ProdFilterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			this.ok(res, { success: true, products: await this.userService.getProductsList(query) });
		} catch (e) {
			return next(e);
		}
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
