import { User } from '../../src/models/userModel';

interface MyWebAppContext {
  user?: User;
}

declare module 'express-serve-static-core' {
  interface Request {
    myWebApp: MyWebAppContext;
  }
}
