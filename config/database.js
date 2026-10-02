import mongoose from 'mongoose';

const mongoUrl = process.env.MONGO_URL ?? 'mongodb://127.0.0.1:27017/express_app';

export const connectDatabase = async () => {
  await mongoose.connect(mongoUrl);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
};