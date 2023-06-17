import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/http/base.controller';
import { HealthCheckControllerInterface } from './health.check.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../common/dependency.injection/types';
import { LoggerInterface } from '../common/logger/logger.interface';
import { ConfigServiceInterface } from '../common/config/config.service.interface';

@injectable()
export class HealthCheckController
	extends BaseController
	implements HealthCheckControllerInterface
{
	constructor(
		@inject(TYPES.LoggerInterface) protected logger: LoggerInterface,
		@inject(TYPES.ConfigService) private configService: ConfigServiceInterface,
	) {
		super(logger);
		this.bindRoutes([
			{
				path: '/',
				method: 'get',
				func: this.healthCheckAction,
			},
		]);
	}

	healthCheckAction(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, {
			success: true,
			message: 'Products API is OK.',
		});
	}
}
