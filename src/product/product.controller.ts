import { BaseController } from '../common/http/base.controller';
import { IProductController } from './interface/product.controller.interface';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../common/dependency.injection/types';
import { ILogger } from '../common/logger/logger.interface';
import { ProdFilterDto } from './dto/prod.filter.dto';
import { IProductService } from './interface/product.service.interface';
import { ProdCreateDto } from './dto/prod.create.dto';
import { GuardMiddleware } from '../common/middleware/auth/guard.middleware';
import { Role } from '@prisma/client';

@injectable()
export class ProductController extends BaseController implements IProductController {
	constructor(
		@inject(TYPES.ILogger) protected logger: ILogger,
		@inject(TYPES.ProductService) private productService: IProductService,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/list',
				method: 'get',
				func: this.getListAction,
			},
			{
				path: '/create',
				method: 'post',
				func: this.createAction,
				middlewares: [new GuardMiddleware([Role.ADMIN])],
			},
		]);
	}
	public async getListAction(
		{ query, body }: Request<{}, {}, ProdFilterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			this.ok(res, { success: true, products: await this.productService.getProductsList(query) });
		} catch (e) {
			return next(e);
		}
	}

	public async createAction(
		{ body }: Request<{}, {}, ProdCreateDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			this.ok(res, { success: true, products: await this.productService.createProduct(body) });
		} catch (e) {
			return next(e);
		}
	}

	editAction(req: Request, res: Response, next: NextFunction): void {
		// ToDo: Изменить продукт
	}

	deleteAction(req: Request, res: Response, next: NextFunction): void {
		// ToDo: Удалить продукт
	}
}
