import { OpenAI } from 'langchain/llms/openai';
import { VectorDBQAChain } from 'langchain/chains';
import { pineconeIndex } from '../init/initPineCone'
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { getPdfInfo, getPdfPath, getPdfText } from '../../../utils/pdfLoader';
import { textSplitter } from '../init/initTextSplitter';
import dotenv from 'dotenv'
import { Document } from 'langchain/document';
import { embeddings } from '../init/initEmbedding';
import { GOAL2 } from '../../../constant';
dotenv.config();

export const trainModel = async() => {
    const docs = await getDocsPerPage();
    const res = await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex,
    });
}

export const queryDocs = async() => {
    // const docs = await getDocsPerPage();
    // const vectorStore = await PineconeStore.fromDocuments(docs, embeddings, {
    //     pineconeIndex,
    // });
    const pdfPath = getPdfPath('document.pdf');
    const pdfInfo =  await getPdfInfo(pdfPath);
    const vectorStore = await PineconeStore.fromExistingIndex(
        embeddings,
        { pineconeIndex }
    );
    // console.log('vectorStore', vectorStore);
    // /* Search the vector DB independently with meta filters */
    // const results = await vectorStore.similaritySearch('what is content for page?', 1, {page: 3});
    // console.log(results);

    /* Use as part of a chain (currently no metadata filters) */
    const model = new OpenAI();
    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
        k: 1,
        returnSourceDocuments: true,
    });

    const finalPrompt = '\n Find the response that meets the following requirements from page 1. Do not include responses from damaged parts. Please indicate the content using dots.\n' + GOAL2; 

    const response = await chain.call({ query: finalPrompt });
    console.log(response);
}

const getDocsPerPage = async(start?: number, end?: number) => {
    const pdfPath = getPdfPath('document.pdf');
    const pdfInfo =  await getPdfInfo(pdfPath);
    
    const maxPageNum = Number(pdfInfo.pages);
    
    let startPageNum = 0, endPageNum = 0;

    if(start !== undefined && end !== undefined) {
        startPageNum = start;
        endPageNum = end;
        if(start > maxPageNum) {
            startPageNum = maxPageNum;
        } else if(start <= 0) {
            startPageNum = 1;
        }
    
        if(end > maxPageNum) {
            endPageNum = maxPageNum + 1;
        } else if(end <= 0) {
            endPageNum = 2;
        }
        
    } else {
        startPageNum = 1;
        endPageNum = maxPageNum + 1;
    }

    let docs: Document[] = [];
    for(let i = startPageNum; i < endPageNum; i++) {
        const doc = await getPdfText(pdfPath, i, i + 1);
        const description = `\nThe above is a content of the page ${i}. \n`;
        const output = await textSplitter(doc + description); 
        for(let j in output) {
            let origin = output[j].metadata;
            output[j].metadata = { ...origin, page: i}
            docs.push(output[j]);
        }
    }

    return docs
}