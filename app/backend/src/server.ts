import { App } from './app';
import 'dotenv/config';

const PORT = process.env.BACKPORT || 3001;

new App().start(PORT); 
