import { Router, Request, Response } from 'express';

const routes = Router();

routes.get('/hello', (req: Request, res: Response) => {
  return res.json({ message: 'Hello works' });
});

routes.get('/', async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: 'Hello World!',
  });
});

export default routes;
