import express from 'express';
import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';
import offerRoutes from './routes/offer.routes';
import { errorHandler } from './utils/errorHandler';

export const startServer = async () => {
  const app = express();
  const orm = await MikroORM.init(mikroOrmConfig);
  app.use(express.json());

  app.use((req, res, next) => {
    req.orm = orm.em.fork();
    next();
  });

  app.use('/offer', offerRoutes);

  app.use(errorHandler);
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
};