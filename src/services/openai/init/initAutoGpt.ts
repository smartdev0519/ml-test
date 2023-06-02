import { AutoGPT } from 'langchain/experimental/autogpt';
import { ReadFileTool, WriteFileTool, SerpAPI } from 'langchain/tools';
import { InMemoryFileStore } from 'langchain/stores/file/in_memory';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { embeddings } from './initEmbedding';
import dotenv from 'dotenv'
dotenv.config();

const store = new InMemoryFileStore();

const tools = [
  new ReadFileTool({ store }),
  new WriteFileTool({ store }),
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: 'San Francisco,California,United States',
    hl: 'en',
    gl: 'us',
  }),
];

const vectorStore = new MemoryVectorStore(embeddings);

export const createAutoGPT = (temperature: number) => {
  const autogpt = AutoGPT.fromLLMAndTools(
    new ChatOpenAI({ temperature }),
    tools,
    {
      memory: vectorStore.asRetriever(),
      aiName: 'Tom',
      aiRole: 'Assistant',
    }
  );
  
  return autogpt;
}