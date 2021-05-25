import jsonwebtoken from 'jsonwebtoken';
import { authService } from '@src/services/authService';
import { authJwtMiddleware } from '../authJwt';
import { errors } from '@src/services/APIError';

const reqFake = {
  headers: {},
};

const nextFake = jest.fn();

const fakeUser = {
  id: 'fake',
  active: false,
  meta: {
    authErrors: 0,
    emailVerified: false,
  },
};

// const jwtToken = authService.generateToken(fakeUser);

describe('AuthMiddleware', () => {
  it(`[No token provided]\n\tShould call next middleware with error: next({key:${errors.UnauthorizedNoTokenProvided.key}})`, async () => {
    authJwtMiddleware()(reqFake, {}, nextFake);

    expect(nextFake).toHaveBeenCalledWith(expect.objectContaining({ ...errors.UnauthorizedNoTokenProvided }));
  });

  /*
	it(`[One part token]\n\tShould call next middleware with error: next({key:${ApiErrorKey.UNAUTHORIZED_INVALID_TOKEN}})`, async () => {
		reqFake.headers = { authorization: 'one-part-token' };

		authJwtMiddleware()(reqFake, {}, nextFake);

		expect(nextFake).toHaveBeenCalledWith(
			expect.objectContaining({ key: ApiErrorKey.UNAUTHORIZED_INVALID_TOKEN }),
		);
	});

	it(`[No Bearer word]\n\tShould call next middleware with error: next({key:${ApiErrorKey.UNAUTHORIZED_INVALID_TOKEN}})`, async () => {
		reqFake.headers = { authorization: 'part1 part2' };

		authMiddleware()(reqFake, {}, nextFake);

		expect(nextFake).toHaveBeenCalledWith(
			expect.objectContaining({ key: ApiErrorKey.UNAUTHORIZED_INVALID_TOKEN }),
		);
	});

	it('[User not found]\n\tShould call next middleware with error: next({key:NOTFOUND})', async () => {
		userRepository.findById = jest.fn().mockImplementationOnce(() => null);
		reqFake.headers = { authorization: `Bearer ${jwtToken}` };

		await authMiddleware()(reqFake, {}, nextFake);

		expect(nextFake).toHaveBeenCalledWith(
			expect.objectContaining({ key: 'NOTFOUNDERROR' }),
		);
	});

	it(`[Inactive account]\n\tShould call next middleware with error: next({key:${ApiErrorKey.UNAUTHORIZED_INACTIVE_ACCOUNT}})`, async () => {
		//fakeUser.active = false;
		userRepository.findById = jest.fn().mockImplementation(() => fakeUser);

		//reqFake.headers = { authorization: `Bearer ${jwtToken}` };

		await authMiddleware()(reqFake, {}, nextFake);

		expect(nextFake).toHaveBeenCalledWith(
			expect.objectContaining({ key: ApiErrorKey.UNAUTHORIZED_INACTIVE_ACCOUNT }),
		);
	});

	it(`[Auth error more than LIMIT]\n\tShould call next middleware with error: next({key:${ApiErrorKey.UNAUTHORIZED_BLOCKED_ACCOUNT}})`, async () => {
		fakeUser.active = true;
		fakeUser.meta.authErrors = config.get('App.auth.authErrorsLimit');
		//UserService.findById = jest.fn().mockImplementationOnce(() => fakeUser);

		//reqFake.headers = { authorization: `Bearer ${jwtToken}` };

		await authMiddleware()(reqFake, {}, nextFake);

		expect(nextFake).toHaveBeenCalledWith(
			expect.objectContaining({ key: ApiErrorKey.UNAUTHORIZED_BLOCKED_ACCOUNT }),
		);
	});

	it(`[Force email no verified]\n\tShould call next middleware with error: next({key:${ApiErrorKey.UNAUTHORIZED_UNVERIFIED_EMAIL}})`, async () => {
		fakeUser.meta.authErrors = 0;
		//fakeUser.meta.emailVerified = false;

		//UserService.findById = jest.fn().mockImplementationOnce(() => fakeUser);

		//reqFake.headers = { authorization: `Bearer ${jwtToken}` };

		await authMiddleware()(reqFake, {}, nextFake);

		expect(nextFake).toHaveBeenCalledWith(
			expect.objectContaining({ key: ApiErrorKey.UNAUTHORIZED_UNVERIFIED_EMAIL }),
		);
	});

	it(`[Alow email no verified]\n\tShould call next middleware with next()`, async () => {
		//fakeUser.meta.emailVerified = false;

		//UserService.findById = jest.fn().mockImplementationOnce(() => fakeUser);

		//reqFake.headers = { authorization: `Bearer ${jwtToken}` };

		await authMiddleware(NO_FORCE_EMAIL_VERIFIED)(reqFake, {}, nextFake);

		expect(nextFake).toHaveBeenCalledWith();
	});
	*/

  it.skip('[JWT OK]\n\tShould call next middleware with next()', async () => {
    fakeUser.active = true;
    fakeUser.meta.emailVerified = true;

    /*
		// mocking User model directly
		User.findById = jest.fn().mockImplementationOnce(() => ({
			select: jest.fn().mockResolvedValueOnce(new User(fakeUser)),
		}));
		*/

    // UserService.findById = jest.fn().mockImplementationOnce(() => fakeUser);

    // reqFake.headers = { authorization: `Bearer ${jwtToken}` };

    await authJwtMiddleware()(reqFake, {}, nextFake);

    expect(nextFake).toHaveBeenCalledWith();
  });

  it.skip(`[Token expired]\n\tShould call next middleware with error: next({key:${errors.UnauthorizedTokenExpired.key}})`, async () => {
    authService.decodeToken = jest.fn().mockImplementationOnce(() => {
      throw new jsonwebtoken.TokenExpiredError('jwt expired', new Date());
    });

    await authJwtMiddleware()(reqFake, {}, nextFake);

    expect(nextFake).toHaveBeenCalledWith(expect.objectContaining({ ...errors.UnauthorizedTokenExpired }));
  });
});
