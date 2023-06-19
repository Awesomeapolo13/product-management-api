import { UserRegisterDto } from './dto/user.register.dto';
import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { TYPES } from '../common/dependency.injection/types';
import { ConfigServiceInterface } from '../common/config/config.service.interface';
import { UserRepositoryInterface } from './user.repository.interface';
import { User } from './user.entity';
import { Role, UserModel } from '@prisma/client';

@injectable()
export class UserService {
	constructor(
		@inject(TYPES.ConfigService) private readonly configService: ConfigServiceInterface,
		@inject(TYPES.UserRepository) private readonly userRepo: UserRepositoryInterface,
	) {}
	public async register({ name, email, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(uuidv4(), name, email, Role.ADMIN, new Date());
		const secret = this.configService.get('SECRET');
		await newUser.setPassword(password, Number(secret));
		const existedUser = await this.userRepo.find(email);
		if (existedUser) {
			return null;
		}

		return this.userRepo.create(newUser);
	}
}
