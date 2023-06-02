import { Request, Response } from 'express'
import blogsDB from '../../db/query/blogs';

export const getBlogsList = async (req: Request, res: Response) => {
    try {
      let data = await blogsDB.getBlogs()
      res.json({ status: 200, data: data});
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
}