import mongoose from 'mongoose';

// In serverless environments, global variables are preserved across "warm" invocations.
// We use this to cache the MongoDB connection so we don't open a new one on every request.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    // Return the cached connection if it exists
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail immediately instead of buffering if connection drops
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log('MongoDB successfully connected');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
};

export default connectDB;
