import { embeddings } from './services/openai/init/initEmbedding'
import { compile } from 'html-to-text';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { pineconeIndex } from './services/openai/init/initPineCone';
import { VectorDBQAChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';
import { Document } from 'langchain/document';
import { SerpAPI, ChainTool } from 'langchain/tools';
import { AutoGPT } from 'langchain/experimental/autogpt';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { Calculator } from 'langchain/tools/calculator';
import { ReadFileTool, WriteFileTool } from 'langchain/tools';
import { InMemoryFileStore } from 'langchain/stores/file/in_memory';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import fs from 'fs';
import { createListFromPdf, getPdfSummary } from './services/openai/createListFromPdf';
import { Ocr } from 'node-ts-ocr';
import * as path from 'path';
import * as temp from 'temp';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import {
  VectorStoreToolkit,
  createVectorStoreAgent,
  VectorStoreInfo,
} from 'langchain/agents';
import createBlogsByAutoGpt from './services/openai/createBlogs';

import { PDFLoader } from 'langchain/document_loaders/fs/pdf';

import { CharacterTextSplitter } from 'langchain/text_splitter';
import { getPdfInfo, getPdfPath } from './utils/pdfLoader';
import { GOAL1, GOAL2, GOAL3 } from './constant';
import check from 'check-types';
import typeCheck from 'type-check'
import { createAutoGPT } from './services/openai/init/initAutoGpt';
import { createSocketServer } from './socket';
import { queryDocs, trainModel } from './services/openai/embdding/pdf';
import { embeddingJsonData } from './services/openai/embdding/json';
import { createJson } from './services/openai/createJson'
import { openai } from './services/openai/init/initOpenAiApi';

export const getJsonPath = (fileName: string) => {
    const relativePath = path.join('src/dataset/jsonl', fileName);
    const __dirname = path.resolve();
    const jsonPath = path.join(__dirname, relativePath);

    return jsonPath;
}

const uploadFile = async(): Promise<string | undefined> => {
  try {
      const jsonLPath = getJsonPath('fine-tuning1.jsonl');
      const f = await openai.createFile(
          fs.createReadStream(jsonLPath),
          "fine-tune"
      );
      console.log(`File ID ${f.data.id}`);
      return f.data.id;
  }
  catch (err: any) {
      console.log('err uploadfile: ', err.response.data);
  } 
}

const makeFineTune = async(fileId: string) => {
  try {
      const ft = await openai.createFineTune({
          training_file: fileId,
          model: 'davinci'
      });
      console.log(ft.data);
   }
  catch (err: any) {
      console.log('err makefinetune: ', err.response.data);
  }
}

const getFineTunedModelName = async() => {
  try {
      const modelName = await openai.listFineTunes();
      console.table(modelName.data.data, ["id", "status", "fine_tuned_model"]);
  }
  catch (err: any) {
      console.log('err getmod: ', err.response.data)
  }
}

const deleteModel = async(model: string) => {
  try {
    const modelName = await openai.deleteModel(model);
    
  }
  catch (err:any) {
      console.log('err getmod: ', err.response.data)
  }
}

const cancelFineTuneModel = async(ftId: string) => {
  try {
    const modelName = await openai.cancelFineTune(ftId);
  }
  catch (err:any) {
      console.log('err getmod: ', err.response.data)
  }
}

async function fineTuning(modelName: string) {
  try {
      const comp = await openai.createCompletion({
          model: modelName,
          prompt: `what is your first name?`, //replace this prompt according to your data
          max_tokens: 200
      });
      if (comp.data) {
          console.log('choices: ', comp.data.choices)
      }
  } catch (err:any) {
      console.log('err: ', err.response.data)
  }
}

const deleteUploadedFile = async(fileId: string) => {
  try {
    await openai.deleteFile(fileId);
    
  }
  catch (err: any) {
      console.log('err getmod: ', err.response.data)
  }
}

export const run = async() => {
  // embeddingDataToHtmlModel();
  // createJson();

  // const fileId = await uploadFile();
  // if(fileId) {
  //   makeFineTune(fileId);
  // }
  // await cancelFineTuneModel('ft-EhCffs825XkNkvxgUCt7d5O2');
  // await cancelFineTuneModel('ft-XNFwkTYsO6YvfYsMAT83DNgG');
  
  // const response = await openai.listFiles();
  // console.log("response", response.data.data);

  // await cancelFineTuneModel('ft-QP0NIj23M0oTzz0WtofoGtus');

  // const res = await deleteModel('davinci:ft-xilo-2023-05-31-08-49-51');
  // console.log('res', res);
  // const modelName = await getFineTunedModelName();
  const response = await openai.listModels();
  console.log('response', response.data.data);

  
};

run();
