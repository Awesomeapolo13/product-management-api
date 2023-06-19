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
import { PrismaService } from '../database/prisma.service';
import { UserRepositoryInterface } from '../../user/user.repository.interface';
import { UserRepository } from '../../user/user.repository';
import { UserService } from '../../user/user.service';
import { UserController } from '../../user/user.controller';
import { UserControllerInterface } from '../../user/user.controller.interface';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	// #region Common
	bind<App>(TYPES.Application).to(App);
	bind<Bootstrap>(TYPES.Bootstrap).to(Bootstrap);
	// #region Common Services
	bind<ExceptionFilterInterface>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<ConfigServiceInterface>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<LoggerInterface>(TYPES.LoggerInterface).to(LoggerService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	// #region Controllers
	bind<HealthCheckControllerInterface>(TYPES.HealthCheckController).to(HealthCheckController);
	// #region User services
	bind<UserControllerInterface>(TYPES.UserController).to(UserController);
	bind<UserService>(TYPES.UserService).to(UserService);
	bind<UserRepositoryInterface>(TYPES.UserRepository).to(UserRepository);
});
