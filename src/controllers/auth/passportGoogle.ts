import config from 'config';
import { Controller, Get, Middleware } from '@overnightjs/core';
import passport from 'passport';
import { Profile, Strategy as GoogleStrategy, StrategyOptions, VerifyCallback } from 'passport-google-oauth20';
import { Response, Request } from 'express';

@Controller('google')
export class PassportGoogle {
  constructor() {
    this.init();
  }

  private init(): void {
    const options: StrategyOptions = {
      clientID: config.get('App.passport.google.clientId'),
      clientSecret: config.get('App.passport.google.clientSecret'),
      callbackURL: `${config.get('App.url')}:${config.get('App.port')}/auth/google/callback`,
    };

    passport.use(
      new GoogleStrategy(options, async function google(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) {
        interface EmailVerify {
          value: string;
          type?: string;
          verified?: boolean;
        }

        const accountEmail = profile.emails.filter(e => {
          const email = e as EmailVerify;
          return email.verified;
        });

        // usuário não aceito para login por não ter email verificado
        if (!accountEmail.length) return done(null, false);

        // const firstName = profile.name?.givenName;
        // const lastName = profile.name?.familyName;
        // const avatar = profile.photos ? profile.photos[0].value : undefined;

        // TODO USER CREATION

        return done(null, profile);
      })
    );
  }

  @Get('')
  @Middleware(
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account',
    })
  )
  public async auth(req: Request, res: Response): Promise<void> {
    res.send({ message: 'If you see this message, then something went wrong' });
  }

  @Get('callback')
  @Middleware(
    passport.authenticate('google', {
      // successRedirect: '/',
      // failureRedirect: '/error',
      session: false,
    })
  )
  public async callBack(req: Request, res: Response): Promise<void> {
    const token = '123token';
    const html = `
			<!DOCTYPE html>
			<html lang="pt-BR">
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title></title>
				</head>
				<body>
					<script>
						localStorage.setItem('token', '${token}');
						var redirect = localStorage.getItem('redirect') || '/';
						localStorage.removeItem('redirect');
						window.location.replace(redirect);
					</script>
				</body>
			</html>		
		`;
    res.send(html);
  }
}
