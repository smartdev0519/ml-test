import { CharacterTextSplitter } from 'langchain/text_splitter';

const splitter = new CharacterTextSplitter({
    separator: ' ',
    chunkSize: 4000,
    chunkOverlap: 200,
});

export const textSplitter = async(text: string) => {
    const output = await splitter.createDocuments([text]);
    return output;
}
 
