import { IUserRepository } from './user.repository.interface';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../common/dependency.injection/types';
import { PrismaService } from '../common/database/prisma.service';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) private readonly prismaService: PrismaService) {}
	public async create(user: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
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
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
