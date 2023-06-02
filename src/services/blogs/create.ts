import { Request, Response } from 'express'
import * as uuid from 'uuid'
import { CreateBlogs } from '../../model';
import blogsDB from '../../db/query/blogs';

export const createBlogs = async(req: Request, res: Response) => {
    try {
        const { title, content } = req.body;
        const timestamp = new Date().getTime().toString();
        
        const data: CreateBlogs = {
          id: uuid.v1(),
          title,
          content,
          createAt: timestamp,
          updateAt: timestamp
        }
    
        await blogsDB.createBlog(data);
        res.json(data);
      } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
      }

}