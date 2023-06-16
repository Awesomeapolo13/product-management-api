import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { ConfigServiceInterface } from './common/config/config.service.interface';
import { TYPES } from './common/dependency.injection/types';
import { LoggerInterface } from './common/logger/logger.interface';
import 'reflect-metadata';
import { ExceptionFilterInterface } from './common/error/exception.filter.interface';

@injectable()
export class App {
	public app: Express;
	public port: number;
	public server: Server;

	constructor(
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
		@inject(TYPES.LoggerInterface) private logger: LoggerInterface,
		@inject(TYPES.ExceptionFilter) private exceptionFilter: ExceptionFilterInterface,
	) {
		this.app = express();
		this.port = Number(configService.get('SERVER_PORT'));
		this.server = this.app.listen(this.port);
	}

	public async init(): Promise<void> {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		this.logger.log(`Сервер запущен на http://localhost:${this.port}`);
	}

	private useRoutes(): void {
		// App's routes are going to be initialized.
	}

	private useMiddleware(): void {
		this.app.use(express.json());
		this.app.use(express.urlencoded());
	}

	private useExceptionFilters(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}
}
