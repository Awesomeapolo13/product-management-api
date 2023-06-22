import { UserRegisterDto } from './dto/user.register.dto';
import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { TYPES } from '../common/dependency.injection/types';
import { ConfigServiceInterface } from '../common/config/config.service.interface';
import { UserRepositoryInterface } from './user.repository.interface';
import { User } from './user.entity';
import { Role, UserModel } from '@prisma/client';
import { UserLoginDto } from './dto/user.login.dto';
import { sign } from 'jsonwebtoken';
import { HttpError } from '../common/error/http.error';
import { HttpStatusCodeEnum } from '../common/http/http.status.code.enum';
import { hash, compare } from 'bcrypt';

@injectable()
export class UserService {
	constructor(
		@inject(TYPES.ConfigService) private readonly configService: ConfigServiceInterface,
		@inject(TYPES.UserRepository) private readonly userRepo: UserRepositoryInterface,
	) {}

	public async register({ name, email, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(uuidv4(), name, email, Role.ADMIN, new Date());
		const secret = this.configService.get('SALT');
		await newUser.setPassword(password, Number(secret));
		const existedUser = await this.userRepo.find(email);
		if (existedUser) {
			return null;
		}

		return this.userRepo.create(newUser);
	}

	public async login({ email, password }: UserLoginDto): Promise<string> {
		const user = await this.userRepo.find(email);
		const hashedPass = await hash(password, Number(this.configService.get('SALT')));
		if (!user || (await compare(hashedPass, user.password))) {
			throw new HttpError(
				HttpStatusCodeEnum.UNAUTHORIZED_CODE,
				'Неверный email или пароль.',
				'Auth',
			);
		}

		return await this.signJWT(user.email, this.configService.get('SECRET'));
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email: email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
