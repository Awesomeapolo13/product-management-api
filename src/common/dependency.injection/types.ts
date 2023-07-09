import { HealthCheckController } from '../../health.check/health.check.controller';

export const TYPES = {
	// #region Common
	Application: Symbol.for('Application'),
	Bootstrap: Symbol.for('Bootstrap'),
	// #endregion Common
	// #region Common Services
	ILogger: Symbol.for('ILogger'),
	LoggerService: Symbol.for('LoggerService'),
	IConfigService: Symbol.for('IConfigService'),
	ConfigService: Symbol.for('ConfigService'),
	IExceptionFilter: Symbol.for('IExceptionFilter'),
	ExceptionFilter: Symbol.for('ExceptionFilter'),
	PrismaService: Symbol.for('PrismaService'),
	AuthMiddleware: Symbol('AuthMiddleware'),
	// #endregion Common Services
	// #region HealthCheck
	HealthCheckController: Symbol.for('HealthCheckController'),
	// #endregion HealthCheck
	// #region User services
	UserController: Symbol.for('UserController'),
	UserService: Symbol.for('UserService'),
	UserRepository: Symbol.for('UserRepository'),
	// #endregion User services
	// #region User services
	ProductController: Symbol.for('ProductController'),
	ProductService: Symbol.for('ProductService'),
	ProductRepository: Symbol.for('ProductRepository'),
	// #endregion User services
};
