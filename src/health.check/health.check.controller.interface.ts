import { Request, Response, NextFunction } from 'express';

export class IHealthCheckController {
	healthCheckAction: (req: Request, res: Response, next: NextFunction) => void;
}
