import { OpenAI } from 'langchain/llms/openai';
import { getPdfInfo, getPdfPath, getPdfText } from '../../utils/pdfLoader';
import { loadSummarizationChain } from 'langchain/chains';
import { textSplitter } from './init/initTextSplitter';
import fs from 'fs';
import dotenv from 'dotenv'
import { Document } from 'langchain/document';
dotenv.config();

export const createListFromPdf = async(prompt: string, start?: number, end?: number) => {
    
    const finalPrompt = '\n From the above information, find the response that meets the following requirements. Do not include responses from damaged parts. Please indicate the content using dots.\n' + prompt; 

    const model = new OpenAI({openAIApiKey: process.env.OPENAI_API_KEY});
    
    const docs = await getDocsPerPage(start, end);
    
    let outputs:any[] = [];
    for(let i in docs) {
        const result = await model.call(
            docs[i].pageContent + finalPrompt
        );
        outputs.push(result);
        fs.appendFile('result.txt', result, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
    }
    
    return outputs;
}

export const getPdfSummary = async() => {
    const pdfPath = getPdfPath('document.pdf');
    const pdfText = await getPdfText(pdfPath);
    const docs = await textSplitter(pdfText);
    const model = new OpenAI({ temperature: 0 });
    const chain = loadSummarizationChain(model, { type: 'refine' });
    const res = await chain.call({
        input_documents: docs,
    });

    return res;
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


