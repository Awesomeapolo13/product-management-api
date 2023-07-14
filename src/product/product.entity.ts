export class Product {
	private _id: number;
	private _updatedAt: Date;
	private _description: string;

	constructor(
		private _name: string,
		private _quantity: number,
		private _price: number,
		private readonly _createdAt: Date,
	) {}

	get id(): number {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	set name(value: string) {
		this._name = value;
	}

	get quantity(): number {
		return this._quantity;
	}

	set quantity(value: number) {
		this._quantity = value;
	}

	get price(): number {
		return this._price;
	}

	set price(value: number) {
		this._price = value;
	}

	get description(): string {
		return this._description;
	}

	set description(value: string) {
		this._description = value;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	set updatedAt(value: Date) {
		this._updatedAt = value;
	}
}
