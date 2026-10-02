import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';

const userMongooseSchema = new mongoose.Schema(
  {
    _id: { type: String, default: randomUUID },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254, unique: true, index: true },
    passwordHash: { type: String, select: false }
  },
  { timestamps: true, versionKey: false }
);

const UserDocument = mongoose.model('User', userMongooseSchema);

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString()
});

export const userModel = {
  async findAll() {
    const users = await UserDocument.find().sort({ createdAt: -1 }).lean();
    return users.map(serializeUser);
  },

  async findById(id) {
    const user = await UserDocument.findById(id).lean();
    return user ? serializeUser(user) : null;
  },

  async findByEmail(email) {
    const user = await UserDocument.findOne({ email }).lean();
    return user ? serializeUser(user) : null;
  },

  async findByEmailForAuth(email) {
    return UserDocument.findOne({ email }).select('+passwordHash').lean();
  },

  async create({ name, email, passwordHash }) {
    const user = await UserDocument.create({ name, email, passwordHash });
    return serializeUser(user);
  },

  async update(id, { name, email }) {
    const user = await UserDocument.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true }
    ).lean();
    return user ? serializeUser(user) : null;
  },

  async delete(id) {
    const user = await UserDocument.findByIdAndDelete(id).lean();
    return user ? serializeUser(user) : null;
  }
};