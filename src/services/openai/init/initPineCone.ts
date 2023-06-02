import { PineconeClient } from '@pinecone-database/pinecone';
import dotenv from 'dotenv'
dotenv.config();

const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY || '',
  environment: process.env.PINECONE_ENVIRONMENT || '',
});
export const pineconeIndex = client.Index(process.env.PINECONE_INDEX || '');

