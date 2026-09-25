import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import multer from 'multer';
import { processDocument } from './services/documentService.js';

export function createApp({ clientOrigin }) {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: clientOrigin }));
  app.use(express.json({ limit: '100kb' }));

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 }
  });

  app.get('/api/health', (_request, response) => {
    response.json({
      success: true,
      message: 'MediKiosk API is running'
    });
  });

  app.post('/api/documents', upload.single('document'), async (request, response) => {
    try {
      const document = await processDocument(request.file);
      response.json({ success: true, document });
    } catch (error) {
      response.status(error.statusCode || 422).json({
        success: false,
        message: error.message || 'Document processing failed.'
      });
    }
  });

  app.use((error, _request, response, _next) => {
    if (error instanceof multer.MulterError) {
      return response.status(400).json({ success: false, message: 'The document is too large or invalid.' });
    }

    return response.status(500).json({ success: false, message: 'The request could not be processed.' });
  });

  return app;
}