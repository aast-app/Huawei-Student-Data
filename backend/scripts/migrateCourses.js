import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Must load env since it's a standalone script
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

// In Node, we can just dynamic import the courses.js file! Wait, the courses.js file has React imports `import { Brain } from 'lucide-react'` which will fail in Node.
// So we need to regex parse it or read it via a special loader.
// Let's just string process it manually, it's safer for this one-time task.
import fs from 'fs';

const courseFile = path.join(__dirname, '../../src/data/courses.js');
const content = fs.readFileSync(courseFile, 'utf8');

import Branch from '../models/Branch.js';

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');
  
  await Branch.deleteMany({});
  console.log('Cleared existing branches');

  // We have a BRANCH_CLASSES object.
  // Easiest is to regex extract.
  const branchRegex = /'([^']+)': \[([\s\S]*?)\]/g;
  let match;
  
  while ((match = branchRegex.exec(content)) !== null) {
    const branchName = match[1];
    const coursesStr = match[2];
    
    const courses = [];
    // { shortName: 'AI', longName: 'AI_Course_AASTMT-ALex', code: '9tWckM', icon: Brain, color: 'text-indigo-600', bg: 'bg-indigo-50', url: '...' }
    const courseRegex = /{\s*shortName:\s*'([^']+)',\s*longName:\s*'([^']+)',\s*code:\s*'([^']+)',\s*icon:\s*([a-zA-Z0-9_]+),\s*color:\s*'([^']+)',\s*bg:\s*'([^']+)',\s*url:\s*'([^']*)'/g;
    
    let courseMatch;
    while ((courseMatch = courseRegex.exec(coursesStr)) !== null) {
      courses.push({
        shortName: courseMatch[1],
        longName: courseMatch[2],
        code: courseMatch[3],
        icon: courseMatch[4],
        color: courseMatch[5],
        bg: courseMatch[6],
        url: courseMatch[7]
      });
    }
    
    await Branch.create({ name: branchName, courses });
    console.log(`Migrated ${branchName} with ${courses.length} courses`);
  }
  
  console.log('Migration complete!');
  process.exit(0);
}

migrate();
