declare namespace Express {
	export interface Request {
		user: UserModel | null;
	}
}
