
import 'dotenv/config';
import { createApp } from './app.js';

const host = '0.0.0.0';
const port = Number(process.env.PORT || 5000);

const clientOrigin =
  process.env.CLIENT_ORIGIN || 'http://localhost:5173';

const app = createApp({ clientOrigin });

app.listen(port, host, () => {
  console.log(`MediKiosk API listening on ${host}:${port}`);
});