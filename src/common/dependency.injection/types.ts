import { HealthCheckController } from '../../health.check/health.check.controller';

export const TYPES = {
	// #region Common
	Application: Symbol.for('Application'),
	Bootstrap: Symbol.for('Bootstrap'),
	// #region Common Services
	LoggerInterface: Symbol.for('LoggerServiceInterface'),
	LoggerService: Symbol.for('LoggerService'),
	ConfigServiceInterface: Symbol.for('ConfigServiceInterface'),
	ConfigService: Symbol.for('ConfigService'),
	ExceptionFilterInterface: Symbol.for('ExceptionFilterInterface'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
	PrismaService: Symbol.for('PrismaService'),
	// #endregion Common Services
	// #region HealthCheck
	HealthCheckController: Symbol.for('HealthCheckController'),
	// #region User services
	UserController: Symbol.for('UserController'),
	UserService: Symbol.for('UserService'),
	UserRepository: Symbol.for('UserRepository'),
};
