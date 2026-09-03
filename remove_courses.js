import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Branch from './backend/models/Branch.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const coursesToRemove = ['Transmission', 'Digital Power', 'Wireless Domain'];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const branches = await Branch.find();
  for (let branch of branches) {
    branch.courses = branch.courses.filter(course => !coursesToRemove.includes(course.shortName));
    await branch.save();
  }
  console.log('Courses removed from all branches');
  process.exit(0);
}
run();
