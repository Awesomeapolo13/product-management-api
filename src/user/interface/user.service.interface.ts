import { UserModel } from '@prisma/client';

export interface IUserService {
	register: (registerModel: {
		name: string;
		email: string;
		password: string;
	}) => Promise<UserModel>;
	login: (loginModel: { email: string; password: string }) => Promise<string>;
	getUserInfo: (model: UserModel) => object;
}
