import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Некорректнный формать email' })
	@IsNotEmpty({ message: 'Укажите Ваш email' })
	email: string;
	@IsString({ message: 'Неверный формат пароля' })
	@IsNotEmpty({ message: 'Укажите Ваш пароль' })
	password: string;
}
