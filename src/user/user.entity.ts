import { hash, genSalt } from 'bcrypt';
import { Role } from '@prisma/client';

export class User {
	private _password: string;

	constructor(
		private readonly _id: string,
		private readonly _name: string,
		private readonly _email: string,
		private readonly _role: Role,
		private readonly _createdAt: Date,
	) {}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get email(): string {
		return this._email;
	}

	get password(): string {
		return this._password;
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, salt);
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get role(): Role {
		return this._role;
	}
}
