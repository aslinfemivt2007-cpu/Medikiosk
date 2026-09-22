import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

export function createApp({ clientOrigin }) {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: clientOrigin }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_request, response) => {
    response.json({
      success: true,
      message: 'MediKiosk API is running'
    });
  });

  return app;
}