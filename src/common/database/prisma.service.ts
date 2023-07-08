import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../dependency.injection/types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class PrismaService {
	public readonly client: PrismaClient;

	constructor(@inject(TYPES.ILogger) private readonly logger: ILogger) {
		this.client = new PrismaClient();
	}

	public async connect(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log('The database connected successfully');
		} catch (e) {
			if (e instanceof Error) {
				throw new Error('Could not connect with database: ' + e.message);
			}
		}
	}

	public async disconnect(): Promise<void> {
		await this.client.$disconnect();
	}
}
