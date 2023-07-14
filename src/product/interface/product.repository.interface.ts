import { ProductModel } from '@prisma/client';
import { Product } from '../product.entity';

export interface IProductRepository {
	getList: (filters?: Record<string, any>) => Promise<ProductModel[]>;
	create: (product: Product) => Promise<ProductModel>;
	remove: () => void;
	edit: () => void;
}
