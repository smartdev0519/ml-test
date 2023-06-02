import fs from 'fs';
import * as path from 'path';

export const getJsonPath = (fileName: string) => {
    const relativePath = path.join('src/dataset/json', fileName);
    const __dirname = path.resolve();
    const jsonPath = path.join(__dirname, relativePath);

    return jsonPath;
}

export const readJson = (jsonPath: string) => {
    let jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    return jsonData;
}
