export interface IProductRepository {
	save: () => void;
	getList: () => void;
	remove: () => void;
	edit: () => void;
}
