import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Branch from './backend/models/Branch.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const colorMap = {
  'AI': { color: 'text-purple-600', bg: 'bg-purple-50' },
  'Big Data': { color: 'text-blue-600', bg: 'bg-blue-50' },
  'Cloud Computing': { color: 'text-sky-600', bg: 'bg-sky-50' },
  'Cloud Service': { color: 'text-slate-600', bg: 'bg-slate-50' },
  '5G': { color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'Datacom': { color: 'text-orange-600', bg: 'bg-orange-50' },
  'Security': { color: 'text-red-600', bg: 'bg-red-50' },
  'IoT': { color: 'text-cyan-600', bg: 'bg-cyan-50' },
  'Computing': { color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'Transmission': { color: 'text-rose-600', bg: 'bg-rose-50' },
  'Digital Power': { color: 'text-amber-600', bg: 'bg-amber-50' },
  'Wireless Domain': { color: 'text-violet-600', bg: 'bg-violet-50' },
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const branches = await Branch.find();
  for (let branch of branches) {
    for (let course of branch.courses) {
      if (colorMap[course.shortName]) {
        course.color = colorMap[course.shortName].color;
        course.bg = colorMap[course.shortName].bg;
      }
    }
    await branch.save();
  }
  console.log('Colors updated');
  process.exit(0);
}
run();
