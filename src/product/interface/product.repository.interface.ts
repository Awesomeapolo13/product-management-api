import { ProductModel } from '@prisma/client';

export interface IProductRepository {
	getList: (filters?: Record<string, any>) => Promise<ProductModel[]>;
	save: () => void;
	remove: () => void;
	edit: () => void;
}
