import 'dotenv/config';
import { createApp } from './app.js';

const host = process.env.SERVER_HOST || '127.0.0.1';
const port = Number(process.env.SERVER_PORT || 5000);
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const app = createApp({ clientOrigin });

app.listen(port, host, () => {
  console.log(`MediKiosk API listening on http://${host}:${port}`);
});