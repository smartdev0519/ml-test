import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { Document } from 'langchain/document';
import { pineconeIndex } from '../init/initPineCone'
import { embeddings } from '../init/initEmbedding';
import { JSON_DESCRIPTION } from '../../../constant';
import dotenv from 'dotenv'
dotenv.config();

export const embeddingJsonData = async(payload, socket) => {
    try {
        const { data } = payload
        const docs = createDocsFromJson(data);

        await PineconeStore.fromDocuments(docs, embeddings, {
            pineconeIndex,
        });
        socket.emit('response-embedding-json-data', { status: 200, message: 'Success'});

    } catch(e) {
        console.log(e);
        socket.emit('response-embedding-json-data', { status: 500, message: 'Failed',  e});
    }
}

export const createDocsFromJson = (json: Object[]): Document[] => {
    let docs:Document[] = [];

    for(let i in json) {
        let doc = {
            pageContent: JSON.stringify(json[i]) + JSON_DESCRIPTION,
            metadata: {type: 'json', index: Number(i) + 1}
        }   

        docs.push(doc);
    }

    return docs;
}

