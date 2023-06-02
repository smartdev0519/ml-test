import { Request, Response } from 'express'
import { CreateBlogs } from '../../model';
import blogsDB from '../../db/query/blogs';

export const updateBlog = async(req: Request, res: Response) => {
    try {
      const { id } = req.params;
        const { title, content } = req.body;
        const timestamp = new Date().getTime().toString();
        
        const data: CreateBlogs = {
          id,
          title,
          content,
          updateAt: timestamp
        }
    
        await blogsDB.updateBlogById(data);
        res.json(data);
      } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
      }

}