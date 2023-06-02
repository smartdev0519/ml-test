import { Request, Response } from 'express'
import blogsDB from '../../db/query/blogs';

export const deleteBlogs = async(req: Request, res: Response) => {
    try {
        const { ids } = req.body;
    
        for(let i in ids) {
            const id = ids[i];
            await blogsDB.deleteBlogById(id);
        }
        
        res.json({status: 200, message: 'Successfully deleted'});
      } catch (e) {
        console.log(e);
        res.status(500).json({ error: e });
      }

}