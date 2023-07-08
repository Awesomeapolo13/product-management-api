import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/http/base.controller';
import { IHealthCheckController } from './health.check.controller.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../common/dependency.injection/types';
import { ILogger } from '../common/logger/logger.interface';
import { IConfigService } from '../common/config/config.service.interface';

@injectable()
export class HealthCheckController extends BaseController implements IHealthCheckController {
	constructor(
		@inject(TYPES.ILogger) protected logger: ILogger,
		@inject(TYPES.ConfigService) private configService: IConfigService,
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

	public healthCheckAction(req: Request, res: Response, next: NextFunction): void {
		this.ok(res, {
			success: true,
			message: 'Products API is OK.',
		});
	}
}
