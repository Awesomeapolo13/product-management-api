import { ProductModel } from '@prisma/client';

export interface IProductService {
	getProductsList: (filters?: {
		name?: string;
		quantity?: number;
		price?: number;
		createdAt?: string;
	}) => Promise<ProductModel[]>;

	createProduct: (prodData: {
		name: string;
		description?: string;
		quantity: number;
		price: number;
	}) => Promise<ProductModel>;

	editProduct: () => void;

	deleteProduct: () => void;
}
