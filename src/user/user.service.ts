import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { TYPES } from '../common/dependency.injection/types';
import { IConfigService } from '../common/config/config.service.interface';
import { IUserRepository } from './interface/user.repository.interface';
import { User } from './user.entity';
import { Role, UserModel } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { HttpError } from '../common/error/http.error';
import { HttpStatusCodeEnum } from '../common/http/http.status.code.enum';
import { hash, compare } from 'bcrypt';
import { IUserService } from './interface/user.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private readonly configService: IConfigService,
		@inject(TYPES.UserRepository) private readonly userRepo: IUserRepository,
	) {}

	public async register({
		name,
		email,
		password,
	}: {
		name: string;
		email: string;
		password: string;
	}): Promise<UserModel> {
		const newUser = new User(uuidv4(), name, email, Role.ADMIN, new Date());
		const secret = this.configService.get('SALT');
		await newUser.setPassword(password, Number(secret));
		const existedUser = await this.userRepo.find(email);
		if (existedUser) {
			throw new HttpError(
				HttpStatusCodeEnum.BAD_REQUEST_CODE,
				'Пользователь с таким email уже существует',
			);
		}

		return this.userRepo.create(newUser);
	}

	public async login({ email, password }: { email: string; password: string }): Promise<string> {
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

	public getUserInfo(model: UserModel): object {
		return {
			name: model.name,
			email: model.email,
			role: model.role,
			createdAt: model.createdAt,
		};
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
