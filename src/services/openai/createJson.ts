import { VectorDBQAChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { embeddings } from './init/initEmbedding';
import { pineconeIndex } from './init/initPineCone';
import { JSON_DESCRIPTION } from '../../constant';

interface IQueryBuffer {
    query: string;
    key: string;
    value: any;
}

interface IHtmlFormJson {
    field: string;
    elementId: string;
    elementType: string;
    elementIndex: number;
    value: string;
}

export const createJson = async(payload, socket) => {
    try {
        const { data } = payload
        const vectorStore = await PineconeStore.fromExistingIndex(
            embeddings,
            { pineconeIndex }
        );

        const model = new OpenAI({temperature: 0});
        const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
            k: 1,
            returnSourceDocuments: true,
        });

        let queryBuffer: IQueryBuffer[] = [];
        for(let i in data) {
            createQueryFromJson(data[i], queryBuffer, i, i);
        }
        
        let result: IHtmlFormJson[] = [];

        for(let i in queryBuffer) {
            const response = await chain.call({ query: queryBuffer[i].query });
            let jsonData = JSON.parse(response.sourceDocuments[0].pageContent.replace(JSON_DESCRIPTION, ''));
            let finalData = getFinalDataFromQueryBuffer(jsonData, queryBuffer[i].key, queryBuffer[i].value);
            socket.emit('response-create-json-data', { status: 200, data: finalData, message: 'Processing'});

            result.push(finalData);
        }

        socket.emit('response-create-json-data', {status: 200, data:{}, message: 'Completed'});

    } catch(e) {
        console.log(e);
        socket.emit('response-create-json-data', {status: 500, message: 'Failed', e});
    }
    
}

const getFinalDataFromQueryBuffer = (jsonData, key, value): IHtmlFormJson => {
    let result: IHtmlFormJson = {
        field: key,
        elementId: jsonData.id,
        elementType: jsonData.tag,
        elementIndex: jsonData.index,
        value: value,
    };

    return result
}

const createQueryFromJson = (data, queryBuffer: IQueryBuffer[], parent: string, key?: string,) => {
    if(typeof data === 'number' || typeof data === 'string') {
        if(key !== undefined) {
            let query = `'${key}': '${data}' in ${parent}. Check the type ${data} and find the type of html form for it And then find the json data of html form that fit type of html.`
            queryBuffer.push({ query, key, value: data})
        }
        
    } else {
        for(let i in data) {
            if(i !== 'id') {
                createQueryFromJson(data[i], queryBuffer, parent, i);
            }
        }
    }
}



