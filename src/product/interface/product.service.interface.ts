export interface IProductService {
	getProductsList: () => string[];
	createProduct: () => void;
	editProduct: () => void;
	deleteProduct: () => void;
}
