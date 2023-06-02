import { Ocr, KeyValue, ExtractTextOptions } from 'node-ts-ocr';
import * as path from 'path';

export const getPdfPath = (fileName: string) => {
    const relativePath = path.join('src/dataset/pdf', fileName);
    const __dirname = path.resolve();
    const pdfPath = path.join(__dirname, relativePath);
    return pdfPath;
}

export const getPdfText = async ( pdfPath: string, from?: number, to?: number): Promise<string> => {
    let options:ExtractTextOptions;
    
    if(from !== undefined && to !== undefined) {
        options = {pdfToTextArgs: { f: from, l: to }, tesseractArgs: { 'l': 'eng', '-psm': 6, 'c': 'preserve_interword_spaces=1' }, convertArgs: { density: '600', trim: '' }};
    } else {
        options = {tesseractArgs: { 'l': 'eng', '-psm': 6, 'c': 'preserve_interword_spaces=1' }, convertArgs: { density: '600', trim: '' }};
    }
    const data = await Ocr.extractText(pdfPath, {...options});

    return data;
}

export const getPdfInfo = async ( pdfPath: string): Promise<KeyValue> => {
    const data = await Ocr.extractInfo(pdfPath);
    return data;
}