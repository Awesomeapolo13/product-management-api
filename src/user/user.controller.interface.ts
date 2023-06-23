import { NextFunction, Request, Response } from 'express';

export interface UserControllerInterface {
	loginAction: (req: Request, res: Response, next: NextFunction) => void;
	registerAction: (req: Request, res: Response, next: NextFunction) => void;
	getProfileAction: (req: Request, res: Response, next: NextFunction) => void;
}
