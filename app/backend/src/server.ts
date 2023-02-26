import { App } from './app';
import 'dotenv/config';

const PORT = process.env.PGPORT || 6762;

new App().start(PORT);
