import passport from 'passport';
import { Application } from 'express';

export const init = (app: Application): void => {
  app.use(passport.initialize());
};
