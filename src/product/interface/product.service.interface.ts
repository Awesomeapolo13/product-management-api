import { ProductModel } from '@prisma/client';

export interface IProductService {
	getProductsList: ({
		name,
		quantity,
		price,
		createdAt,
	}: {
		name?: string;
		quantity?: number;
		price?: number;
		createdAt?: string;
	}) => Promise<ProductModel[]>;
	createProduct: () => void;
	editProduct: () => void;
	deleteProduct: () => void;
}
