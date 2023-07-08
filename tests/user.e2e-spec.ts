import { App } from '../src/app';
import { boot } from '../public';
import request from 'supertest';
import { HttpStatusCodeEnum } from '../src/common/http/http.status.code.enum';
import { PrismaService } from '../src/common/database/prisma.service';
import { LoggerService } from '../src/common/logger/logger.service';

let application: App;
let JWT: string | null | undefined;
let prismaService: PrismaService;
let testUser: { name: string; email: string; password: string };

beforeAll(async () => {
	const { app } = await boot;
	prismaService = new PrismaService(new LoggerService());
	testUser = {
		name: 'newUser',
		email: 'newUser@mail.ru',
		password: '123456',
	};
	application = app;
	await prismaService.connect();
	JWT = null;
});

describe('User e2e', () => {
	it('Register errors - empty name', async () => {
		const res = await request(application.app).post('/user/register').send({
			email: testUser.email,
			password: testUser.password,
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
			name: testUser.name,
			password: testUser.password,
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
			name: testUser.name,
			email: '@mail.ru',
			password: testUser.password,
		});
		expect(res.statusCode).toBe(HttpStatusCodeEnum.BAD_REQUEST_CODE);
		expect(res.body.length).toBe(1);

		for (const error of res.body) {
			expect(Object.keys(error.constraints).length).toBe(1);
			expect(error.constraints.isEmail).toBe('Некорректнный формать email');
		}
	});

	it('Register - success', async () => {
		const res = await request(application.app).post('/user/register').send(testUser);
		expect(res.statusCode).toBe(HttpStatusCodeEnum.OK_CODE);
		expect(res.body.success).toBe(true);
		expect(res.body.user.email).toBe('newUser@mail.ru');
	});

	it('Register - a user with such email already exists', async () => {
		const res = await request(application.app).post('/user/register').send(testUser);
		expect(res.statusCode).toBe(HttpStatusCodeEnum.BAD_REQUEST_CODE);
		expect(res.body.success).toBe(false);
		expect(res.body.err).toBe('Пользователь с таким email уже существует');
	});

	it('Login - empty email', async () => {
		const res = await request(application.app).post('/user/login').send({
			password: testUser.password,
		});
		expect(res.statusCode).toBe(HttpStatusCodeEnum.BAD_REQUEST_CODE);
		expect(res.body.length).toBe(1);

		for (const error of res.body) {
			expect(Object.keys(error.constraints).length).toBe(2);
			expect(error.constraints.isNotEmpty).toBe('Укажите Ваш email');
			expect(error.constraints.isEmail).toBe('Некорректнный формать email');
		}
	});

	it('Login - wrong email', async () => {
		const res = await request(application.app).post('/user/login').send({
			email: '@mail.ru',
			password: testUser.password,
		});
		expect(res.statusCode).toBe(HttpStatusCodeEnum.BAD_REQUEST_CODE);
		expect(res.body.length).toBe(1);

		for (const error of res.body) {
			expect(Object.keys(error.constraints).length).toBe(1);
			expect(error.constraints.isEmail).toBe('Некорректнный формать email');
		}
	});

	it('Login - empty password', async () => {
		const res = await request(application.app).post('/user/login').send({
			email: testUser.email,
		});
		expect(res.statusCode).toBe(HttpStatusCodeEnum.BAD_REQUEST_CODE);
		expect(res.body.length).toBe(1);

		for (const error of res.body) {
			expect(Object.keys(error.constraints).length).toBe(2);
			expect(error.constraints.isNotEmpty).toBe('Укажите Ваш пароль');
			expect(error.constraints.isString).toBe('Неверный формат пароля');
		}
	});

	it('Login - wrong password type', async () => {
		const res = await request(application.app)
			.post('/user/login')
			.send({
				email: testUser.email,
				password: Number(testUser.password),
			});
		expect(res.statusCode).toBe(HttpStatusCodeEnum.BAD_REQUEST_CODE);
		expect(res.body.length).toBe(1);

		for (const error of res.body) {
			expect(Object.keys(error.constraints).length).toBe(1);
			expect(error.constraints.isString).toBe('Неверный формат пароля');
		}
	});

	it('Login - success', async () => {
		const res = await request(application.app).post('/user/login').send({
			email: testUser.email,
			password: testUser.password,
		});
		expect(res.statusCode).toBe(HttpStatusCodeEnum.OK_CODE);
		expect(res.body.success).toBe(true);
		expect(res.body.jwt).not.toBeUndefined();
		expect(res.body.jwt).not.toBeNull;
		JWT = res.body.jwt;
	});

	it('Get user info - success', async () => {
		const res = await request(application.app)
			.get('/user/profile')
			.set('Authorization', 'Bearer ' + JWT)
			.send();
		expect(res.statusCode).toBe(HttpStatusCodeEnum.OK_CODE);
		expect(res.body.success).toBe(true);
		expect(res.body.user).not.toBeUndefined();
		expect(res.body.user).not.toBeNull();
		expect(res.body.user.createdAt).not.toBeUndefined();
		expect(res.body.user.createdAt).not.toBeNull();
		expect(res.body.user.name).toBe(testUser.name);
		expect(res.body.user.email).toBe(testUser.email);
		expect(res.body.user.role).toBe('ADMIN');
	});

	it('Get user info - unauthorized empty token', async () => {
		const res = await request(application.app)
			.get('/user/profile')
			.set(
				'Authorization',
				'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Ik1GS1IyQG1haWwucnUiLCJpYXQiOjE2ODc1MDk2NDh9.4xJhbDO93SF9BV9Ic41tkRwjJTOTwrlmfJs-ZGrPCXc',
			)
			.send();
		expect(res.statusCode).toBe(HttpStatusCodeEnum.UNAUTHORIZED_CODE);
		expect(res.body.success).toBe(false);
		expect(res.body.err).toBe('Вы не авторизованы.');
	});

	it('Get user info - unauthorized wrong token', async () => {
		const res = await request(application.app).get('/user/profile').send();
		expect(res.statusCode).toBe(HttpStatusCodeEnum.UNAUTHORIZED_CODE);
		expect(res.body.success).toBe(false);
		expect(res.body.err).toBe('Вы не авторизованы.');
	});
});

afterAll(async () => {
	// Удаляем тестового пользователя.
	await prismaService.client.userModel.delete({
		where: {
			email: 'newUser@mail.ru',
		},
	});
	await prismaService.disconnect();
	application.close();
});
