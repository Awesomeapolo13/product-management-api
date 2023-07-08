import { ContainerModule, interfaces } from 'inversify';
import { App } from '../../app';
import { TYPES } from './types';
import { ILogger } from '../logger/logger.interface';
import { LoggerService } from '../logger/logger.service';
import { IConfigService } from '../config/config.service.interface';
import { ConfigService } from '../config/config.service';
import { Bootstrap } from '../bootstrap';
import { IExceptionFilter } from '../error/exception.filter.interface';
import { ExceptionFilter } from '../error/exception.filter';
import { IHealthCheckController } from '../../health.check/health.check.controller.interface';
import { HealthCheckController } from '../../health.check/health.check.controller';
import { PrismaService } from '../database/prisma.service';
import { IUserRepository } from '../../user/interface/user.repository.interface';
import { UserRepository } from '../../user/user.repository';
import { UserService } from '../../user/user.service';
import { UserController } from '../../user/user.controller';
import { IUserController } from '../../user/interface/user.controller.interface';
import { IUserService } from '../../user/interface/user.service.interface';
import { AuthMiddleware } from '../middleware/auth/auth.middleware';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	// #region Common
	bind<App>(TYPES.Application).to(App);
	bind<Bootstrap>(TYPES.Bootstrap).to(Bootstrap);
	// #region Common Services
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
	// #region Controllers
	bind<IHealthCheckController>(TYPES.HealthCheckController).to(HealthCheckController);
	// #region User services
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
});
