import mongoose from 'mongoose';
import app from './app';

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI must be defined!');
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
