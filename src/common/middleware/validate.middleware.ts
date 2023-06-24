import { MiddlewareInterface } from './middleware.interface';
import { Request, NextFunction, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { HttpStatusCodeEnum } from '../http/http.status.code.enum';
import { validate, ValidationError } from 'class-validator';

export class ValidateMiddleware implements MiddlewareInterface {
	constructor(private classToValidate: ClassConstructor<object>) {}
	public async execute(
		{ method, query, body }: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const dto = await this.mapToDto(method, query, body);
		const errors = await this.getErrors(dto);

		errors.length > 0 ? res.status(HttpStatusCodeEnum.BAD_REQUEST_CODE).send(errors) : next();
	}

	private async mapToDto(method: string, query: any, body: any): Promise<object> {
		switch (method) {
			case 'GET':
				return plainToInstance(this.classToValidate, query);
			case 'POST':
				return plainToInstance(this.classToValidate, body);
			default:
				return plainToInstance(this.classToValidate, null);
		}
	}

	private async getErrors(dto: object): Promise<ValidationError[]> {
		return await validate(dto);
	}
}
