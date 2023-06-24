import { App } from '../src/app';
import { boot } from '../public';
import request from 'supertest';
import { HttpStatusCodeEnum } from '../src/common/http/http.status.code.enum';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('User e2e', () => {
	it('Register errors - empty name', async () => {
		const res = await request(application.app).post('/user/register').send({
			email: 'newUser@mail.ru',
			password: '123456',
		});
		expect(res.statusCode).toBe(HttpStatusCodeEnum.BAD_REQUEST_CODE);
		expect(res.body.length).toBe(1);

		for (const error of res.body) {
			expect(Object.keys(error.constraints).length).toBe(2);
			expect(error.constraints.isNotEmpty).toBe('Укажите имя пользователя');
			expect(error.constraints.isString).toBe('Неверный формат имени');
		}
	});

	it('Register error - empty email', async () => {
		const res = await request(application.app).post('/user/register').send({
			name: 'newUser',
			password: '123456',
		});
		expect(res.statusCode).toBe(HttpStatusCodeEnum.BAD_REQUEST_CODE);
		expect(res.body.length).toBe(1);

		for (const error of res.body) {
			expect(Object.keys(error.constraints).length).toBe(2);
			expect(error.constraints.isNotEmpty).toBe('Укажите Ваш email');
			expect(error.constraints.isEmail).toBe('Некорректнный формать email');
		}
	});

	it('Register error - wrong email', async () => {
		const res = await request(application.app).post('/user/register').send({
			name: 'newUser',
			email: '@mail.ru',
			password: '123456',
		});
		expect(res.statusCode).toBe(HttpStatusCodeEnum.BAD_REQUEST_CODE);
		expect(res.body.length).toBe(1);

		for (const error of res.body) {
			expect(Object.keys(error.constraints).length).toBe(1);
			expect(error.constraints.isEmail).toBe('Некорректнный формать email');
		}
	});

	it('Register - success', async () => {
		const res = await request(application.app).post('/user/register').send({
			name: 'newUser',
			email: 'newUser@mail.ru',
			password: '123456',
		});
		expect(res.statusCode).toBe(HttpStatusCodeEnum.OK_CODE);
		expect(res.body.user.email).toBe('newUser@mail.ru');
	});

	it('Register - a user with such email already exists', async () => {
		const res = await request(application.app).post('/user/register').send({
			name: 'newUser',
			email: 'newUser@mail.ru',
			password: '123456',
		});
		expect(res.statusCode).toBe(HttpStatusCodeEnum.BAD_REQUEST_CODE);
		expect(res.body.success).toBe(false);
		expect(res.body.err).toBe('Пользователь с таким email уже существует');
	});
});

afterAll(() => {
	application.close();
});
