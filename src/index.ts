import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { xormRouter } from './routes/xorm.routes';
import { projectRouter } from './routes/project.routes';
import { apiRouter } from './routes/api.routes';

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error('MONGODB_URL must be defined!');
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

const start = async () => {
  
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }, (err) => {
    if (err) {
      throw new Error(`ERROR connecting DB ${err}`);
    }

    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  });
}

start();
