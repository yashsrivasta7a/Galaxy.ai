
import MemoryClient from 'mem0ai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export const client = new MemoryClient({
    apiKey: process.env.MEM0AI_KEY || '',
});