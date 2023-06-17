import { HealthCheckController } from '../../health.check/health.check.controller';

export const TYPES = {
	// #region Common
	Application: Symbol('Application'),
	Bootstrap: Symbol('Bootstrap'),
	// #region Common Services
	LoggerInterface: Symbol('LoggerServiceInterface'),
	LoggerService: Symbol('LoggerService'),
	ConfigServiceInterface: Symbol('ConfigServiceInterface'),
	ConfigService: Symbol('ConfigService'),
	ExceptionFilterInterface: Symbol('ExceptionFilterInterface'),
	ExceptionFilter: Symbol('ExceptionFilter'),
	// #region Controller
	HealthCheckController: Symbol('HealthCheckController'),
};
