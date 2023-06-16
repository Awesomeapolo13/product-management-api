import { ContainerModule, interfaces } from 'inversify';
import { App } from '../../app';
import { TYPES } from './types';
import { LoggerInterface } from '../logger/logger.interface';
import { LoggerService } from '../logger/logger.service';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { ConfigService } from '../config/config.service';
import { Bootstrap } from '../bootstrap';
import { ExceptionFilterInterface } from '../error/exception.filter.interface';
import { ExceptionFilter } from '../error/exception.filter';
import { HealthCheckControllerInterface } from '../../health.check/health.check.controller.interface';
import { HealthCheckController } from '../../health.check/health.check.controller';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	// #region Common
	bind<App>(TYPES.Application).to(App);
	bind<Bootstrap>(TYPES.Bootstrap).to(Bootstrap);
	// #region Common Services
	bind<ExceptionFilterInterface>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<ConfigServiceInterface>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<LoggerInterface>(TYPES.LoggerInterface).to(LoggerService).inSingletonScope();
	// #region Controllers
	bind<HealthCheckControllerInterface>(TYPES.HealthCheckController).to(HealthCheckController);
});
