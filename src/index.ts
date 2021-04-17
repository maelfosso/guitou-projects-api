import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined!');
}

if (!process.env.MONGODB_DBNAME) {
  throw new Error('MONGODB_DBNAME must be defined!');
}

if (!process.env.RABBITMQ_URI) {
  throw new Error('RABBITMQ_URI must be defined!');
}

if (!process.env.JWT_PUBLIC_KEY) {
  throw new Error('JWT_PUBLIC must be defined!');
}

const start = async () => {
  mongoose.set('toJSON', { virtuals: true });
  mongoose.set('debug', true);
  
  mongoose.connect(MONGODB_URI, {
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
