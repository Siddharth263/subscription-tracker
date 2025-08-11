import mongoose from 'mongoose';
import {DB_URI, NODE_ENV} from '../config/env.js';

if(!DB_URI) {
    throw new Error('define the mondodb uri in .env.<development/production>.js');
}

const connectToDatabase = async() => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to database...${NODE_ENV}`);
    } catch (e) {
        console.log('error connecting to db: ',e);
        process.exit(1);
    }
}

export default connectToDatabase;