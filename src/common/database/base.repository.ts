import { inject, injectable } from 'inversify';
import { TYPES } from '../dependency.injection/types';
import { PrismaService } from './prisma.service';

@injectable()
export abstract class BaseRepository {
	constructor(@inject(TYPES.PrismaService) protected readonly _prismaService: PrismaService) {}
}
