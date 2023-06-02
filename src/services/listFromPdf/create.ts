import { Request, Response } from 'express'
import { createListFromPdf } from '../openai/createListFromPdf';

export const createList = async(req:Request, res: Response) => {
    try {
        const { prompt, start, end } = req.body;
        const data = await createListFromPdf(prompt, start, end);
        res.json({ status: 200, data: data})
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
    }

}