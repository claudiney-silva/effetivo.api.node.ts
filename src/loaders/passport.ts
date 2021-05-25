import { Application } from 'express';
import passport from 'passport';

export const init = (app: Application): void => {
  app.use(passport.initialize());
};
