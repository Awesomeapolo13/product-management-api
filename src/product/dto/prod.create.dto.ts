import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProdCreateDto {
	@IsString({ message: 'Имя продукта должно быть строковым типом' })
	@IsNotEmpty({ message: 'Не указано имя продукта' })
	name: string;

	@IsString({ message: 'Описание продукта должно быть строковым типом' })
	description?: string;

	@IsNumber(
		{ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
		{ message: 'Количество продукта должно быть целым числом типом' },
	)
	@IsNotEmpty({ message: 'Не указано количество продукта' })
	quantity: number;

	@IsNumber(
		{ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 },
		{ message: 'Цена продукта должна быть целым числом типом' },
	)
	@IsNotEmpty({ message: 'Не указана цена продукта' })
	price: number;
}
