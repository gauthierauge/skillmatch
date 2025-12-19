import express from 'express';
import cors from 'cors';
import { createDependencies } from '@/config/dependencies';
import { createAppRouter } from '@/routers';
import { jsonApiResponseMiddleware, errorHandlerMiddleware } from '@/middlewares';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(jsonApiResponseMiddleware);

  const dependencies = createDependencies();

  const apiRouter = createAppRouter(dependencies);
  app.use('/api', apiRouter);

  app.get('/', (req, res) => {
    res.json({
      message: 'Bienvenue sur SkillMatch API!',
      version: 'v1',
      endpoints: {
        freelances: '/api/v1/freelances',
        entreprises: '/api/v1/entreprises',
        projetsOuverts: '/api/v1/projets/ouverts',
      },
    });
  });

  app.use(errorHandlerMiddleware);

  return app;
}
