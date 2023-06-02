import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import dotenv from 'dotenv'
dotenv.config();

export const embeddings = new OpenAIEmbeddings({
    timeout: 1000000, // 1000s timeout
    openAIApiKey: process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY,
});
  