import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Branch from './backend/models/Branch.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const branches = await Branch.find();
  for (let branch of branches) {
    const hasDigitalPower = branch.courses.some(c => c.shortName === 'Digital Power');
    if (!hasDigitalPower) {
      const prefix = branch.name.replace(' (AbuQir)', '').replace('ENG (Sheraton)', 'ENG').toUpperCase();
      branch.courses.push({
        shortName: 'Digital Power',
        longName: `Digital Power_Course_${prefix}`,
        code: 'TBA',
        icon: 'Zap',
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        url: ''
      });
      await branch.save();
    }
  }
  console.log('Digital Power added back to all branches');
  process.exit(0);
}
run();
