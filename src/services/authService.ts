import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';
import { cache } from '@src/util/cache';
import { User, UserModel } from '@src/models/userModel';
import APIError, { errors } from '@src/services/APIError';

export interface DecodedUser {
  id: string;
}

export interface AuthJwt {
  user?: User;
  token: string;
  refreshToken: string;
}

class AuthService {
  public async hashPassword(password: string, salt = 10): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public generateToken(payload: DecodedUser): string {
    return jwt.sign(payload, config.get('App.auth.token.key'), {
      // eslint-disable-next-line no-eval
      expiresIn: eval(config.get('App.auth.token.expiresIn')),
    });
  }

  public decodeToken(token: string): DecodedUser {
    return jwt.verify(token, config.get('App.auth.token.key')) as DecodedUser;
  }

  public generateRefreshToken(payload: DecodedUser): string {
    return jwt.sign(payload, config.get('App.auth.refreshToken.key'), {
      // eslint-disable-next-line no-eval
      expiresIn: eval(config.get('App.auth.refreshToken.expiresIn')),
    });
  }

  public decodeRefreshToken(token: string): DecodedUser {
    return jwt.verify(token, config.get('App.auth.refreshToken.key')) as DecodedUser;
  }

  public generateAuthJwt(user: User): Promise<AuthJwt> {
    const token = this.generateToken({ id: user.id! });
    const refreshToken = this.generateRefreshToken({ id: user.id! });

    // refresh-token cache
    // eslint-disable-next-line no-eval
    cache.set<string>(token, refreshToken, eval(config.get('App.auth.refreshToken.expiresIn')));

    return Promise.resolve({
      user,
      token,
      refreshToken,
    });
  }

  public async auth(email: string, password: string): Promise<AuthJwt> {
    const model = await UserModel.findOne({ email }).select('+password +meta');
    if (!model) throw new APIError({ ...errors.NotFound, message: 'User not found' });

    if (!model.password || !(await this.comparePasswords(password, model.password))) {
      throw new APIError({
        ...errors.Unauthorized,
        message: 'Password does not match',
        data: [{ param: 'password', message: 'password does not match' }],
      });
    }

    model.password = undefined;

    return this.generateAuthJwt(<User>model);
  }

  public async grantToken(token: string, { forceEmailVerified = true }): Promise<User> {
    try {
      const decoded = this.decodeToken(token);
      const user = await UserModel.findById(decoded.id).select('+meta');

      if (!user) throw new APIError({ ...errors.NotFound, message: 'User not found' });

      if (!user.active) throw new APIError({ ...errors.Unauthorized, message: 'Inactive account' });

      if (user.meta?.authErrors && user.meta?.authErrors >= config.get<number>('App.auth.authErrorsLimit')) {
        throw new APIError({ ...errors.Unauthorized, message: 'Blocked account' });
      }

      if (forceEmailVerified && !user.meta.emailVerified) {
        throw new APIError({ ...errors.Unauthorized, message: 'Unverified email' });
      }

      return <User>user;
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        if (err instanceof jwt.TokenExpiredError) {
          throw new APIError({
            ...errors.UnauthorizedTokenExpired,
            data: [{ param: 'token', message: `expired at ${err.expiredAt}` }],
          });
        } else {
          throw new APIError({ ...errors.UnauthorizedTokenInvalid });
        }
      } else {
        throw err;
      }
    }
  }

  public async refreshToken(token: string, refreshToken: string): Promise<AuthJwt> {
    const refreshTokenCache = cache.get<string>(token);

    if (!refreshTokenCache || refreshTokenCache !== refreshToken) {
      throw new APIError({ ...errors.NotFound, message: 'Refresh token not found' });
    }

    // remove from cache
    cache.remove(token);

    try {
      const decoded = this.decodeRefreshToken(refreshToken);

      const user = await UserModel.findById(decoded.id).select('+meta');
      if (!user) throw new APIError({ ...errors.NotFound, message: 'User not found' });

      return this.generateAuthJwt(<User>user);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        if (err instanceof jwt.TokenExpiredError) {
          throw new APIError({
            ...errors.UnauthorizedTokenExpired,
            data: [{ param: 'refreshToken', message: `expired at ${err.expiredAt}` }],
          });
        } else {
          throw new APIError({
            ...errors.UnauthorizedTokenInvalid,
            message: 'Invalid refresh token',
          });
        }
      } else {
        throw err;
      }
    }
  }
}

export const authService = new AuthService();
