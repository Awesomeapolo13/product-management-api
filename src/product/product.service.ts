import { IProductService } from './interface/product.service.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../common/dependency.injection/types';
import { IProductRepository } from './interface/product.repository.interface';
import { ProductModel } from '@prisma/client';

@injectable()
export class ProductService implements IProductService {
	constructor(@inject(TYPES.ProductRepository) private readonly productRepo: IProductRepository) {}

	public async getProductsList(filters?: {
		name?: string;
		quantity?: number;
		price?: number;
		createdAt?: string;
	}): Promise<ProductModel[]> {
		// Формирование критериев для фильтрации.
		const criteria: Record<string, any> = {};

		if (filters) {
			for (const [criteriaKey, criteriaVal] of Object.entries(filters)) {
				if (typeof criteriaKey === 'string' && criteriaVal) {
					criteria[criteriaKey] = criteriaVal;
				}
			}
		}
		// ToDo: Прикрутить пагинацию отдельно.

		return await this.productRepo.getList(criteria);
	}
	createProduct(): void {
		// Todo: Реализовать сохранение продукта.
	}

	editProduct(): void {
		// Todo: Реализовать изменение продукта.
	}

	deleteProduct(): void {
		// Todo: Реализовать удаление продукта.
	}
}
