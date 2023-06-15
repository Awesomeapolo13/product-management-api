import { ContainerModule, interfaces } from 'inversify';
import { App } from '../../app';
import { TYPES } from './types';
import { LoggerInterface } from '../logger/logger.interface';
import { LoggerService } from '../logger/logger.service';
import { ConfigServiceInterface } from '../config/config.service.interface';
import { ConfigService } from '../config/config.service';
import { Bootstrap } from '../bootstrap';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ConfigServiceInterface>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<LoggerInterface>(TYPES.LoggerInterface).to(LoggerService).inSingletonScope();
	bind<Bootstrap>(TYPES.Bootstrap).to(Bootstrap);
	bind<App>(TYPES.Application).to(App);
});
