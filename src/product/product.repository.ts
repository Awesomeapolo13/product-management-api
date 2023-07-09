import { IProductRepository } from './interface/product.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../common/dependency.injection/types';
import { PrismaService } from '../common/database/prisma.service';
import { BaseRepository } from '../common/database/base.repository';
import { ProductModel } from '@prisma/client';

@injectable()
export class ProductRepository extends BaseRepository implements IProductRepository {
	constructor(@inject(TYPES.PrismaService) protected readonly _prismaService: PrismaService) {
		super(_prismaService);
	}

	public async getList(filters?: Record<string, any>): Promise<ProductModel[]> {
		return this._prismaService.client.productModel.findMany({
			where: filters,
			orderBy: {
				createdAt: 'desc',
			},
		});
	}

	public save(): void {
		// Todo: Реализовать сохранение записи в БД.
	}

	public edit(): void {
		// Todo: Реализовать редактирование записи в БД.
	}

	public remove(): void {
		// Todo: Реализовать удаление записи в БД.
	}
}
