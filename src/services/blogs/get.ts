import { Request, Response } from 'express'
import blogsDB from '../../db/query/blogs';

export const getBlog = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      let data = await blogsDB.getBlogsById(id)
      res.json({ status: 200, data: data});
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
}