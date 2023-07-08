import { BaseController } from '../common/http/base.controller';
import { IProductController } from './interface/product.controller.interface';
import { NextFunction, Request, Response } from 'express';

export class ProductController extends BaseController implements IProductController {
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
