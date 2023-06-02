import { BabyAGI } from 'langchain/experimental/babyagi';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'langchain/llms/openai';

const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

export const babyAGI = BabyAGI.fromLLM({
  llm: new OpenAI({ temperature: 0 }),
  vectorstore: vectorStore,
  maxIterations: 3,
});
