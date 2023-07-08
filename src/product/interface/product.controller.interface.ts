import { NextFunction, Request, Response } from 'express';

export interface IProductController {
	getListAction: (req: Request, res: Response, next: NextFunction) => void;
	createAction: (req: Request, res: Response, next: NextFunction) => void;
	editAction: (req: Request, res: Response, next: NextFunction) => void;
	deleteAction: (req: Request, res: Response, next: NextFunction) => void;
}
