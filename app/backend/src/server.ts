import { App } from './app';
import 'dotenv/config';

const PORT = process.env.PGPORT || 6367;

new App().start(PORT);
