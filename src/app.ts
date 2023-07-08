import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { IConfigService } from './common/config/config.service.interface';
import { TYPES } from './common/dependency.injection/types';
import { ILogger } from './common/logger/logger.interface';
import 'reflect-metadata';
import { IExceptionFilter } from './common/error/exception.filter.interface';
import { HealthCheckController } from './health.check/health.check.controller';
import { PrismaService } from './common/database/prisma.service';
import { UserController } from './user/user.controller';
import { AuthMiddleware } from './common/middleware/auth/auth.middleware';

@injectable()
export class App {
	public app: Express;
	public port: number;
	public server: Server;

	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: IExceptionFilter,
		@inject(TYPES.AuthMiddleware) private authMiddleware: AuthMiddleware,
		@inject(TYPES.PrismaService) private readonly prismaService: PrismaService,
		@inject(TYPES.HealthCheckController) private healthCheckController: HealthCheckController,
		@inject(TYPES.UserController) private readonly userController: UserController,
	) {
		this.app = express();
		this.port = Number(configService.get('SERVER_PORT'));
		this.server = this.app.listen(this.port);
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		await this.usePrismaOrm();
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}

	public close(): void {
		this.server.close();
	}

	private useRoutes(): void {
		this.app.use('/health-check', this.healthCheckController.router);
		this.app.use('/user', this.userController.router);
	}

	private useMiddleware(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded());
		this.app.use(this.authMiddleware.execute.bind(this.authMiddleware));
	}

	private useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}

	private async usePrismaOrm(): Promise<void> {
		await this.prismaService.connect();
	}
}
