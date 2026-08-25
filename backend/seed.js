import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Setting from './models/Setting.js';

dotenv.config();

const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    // Check if settings already exist
    const existing = await Setting.findOne();
    
    if (existing) {
      console.log('Updating existing admin password...');
      existing.adminPassword = 'aast@iec@2026';
      await existing.save();
    } else {
      console.log('Creating new settings document...');
      await Setting.create({ adminPassword: 'aast@iec@2026' });
    }
    
    console.log('Successfully seeded admin password into MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
