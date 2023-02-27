import { App } from './app';
import 'dotenv/config';

const PORT = process.env.BACKPORT || 3000;

new App().start(PORT);
