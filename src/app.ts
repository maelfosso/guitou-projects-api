import express from 'express';
import 'express-async-errors';
// import mongoose from 'mongoose';
import morgan from 'morgan';

import { xormRouter } from './routes/xorm.routes';
import { projectRouter } from './routes/project.routes';
import { apiRouter } from './routes/api.routes';

import { errorHandler } from './middlewares/error-handler';

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined!');
}

const app = express();
app.use(express.json());
app.use(morgan('combined'));

app.use(apiRouter);
app.use(xormRouter);
app.use(projectRouter);

app.all('*', async () => {
  throw new Error('Route Not Found');
});

// Handle errors
app.use(errorHandler);

export default app;
