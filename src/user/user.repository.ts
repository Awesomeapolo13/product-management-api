import { IUserRepository } from './interface/user.repository.interface';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../common/dependency.injection/types';
import { PrismaService } from '../common/database/prisma.service';
import { BaseRepository } from '../common/database/base.repository';

@injectable()
export class UserRepository extends BaseRepository implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) protected readonly _prismaService: PrismaService) {
		super(_prismaService);
	}

	public async create(user: User): Promise<UserModel> {
		return this._prismaService.client.userModel.create({
			data: {
				id: user.id,
				name: user.name,
				email: user.email,
				password: user.password,
				role: user.role,
				createdAt: user.createdAt,
			},
		});
	}

	public async find(email: string): Promise<UserModel | null> {
		return this._prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
