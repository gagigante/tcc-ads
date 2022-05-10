import 'reflect-metadata';
import 'dotenv/config';

import { app } from './app';

app.listen(3333, () => console.log('App is running at port 3333'));
