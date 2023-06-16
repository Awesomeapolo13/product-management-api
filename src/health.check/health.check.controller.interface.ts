import { Request, Response, NextFunction } from 'express';

export class HealthCheckControllerInterface {
	healthCheckAction: (req: Request, res: Response, next: NextFunction) => void;
}
