import express from 'express';
import { createBlogs } from './services/blogs/create';
import { getBlogsList } from './services/blogs/list';
import { getBlog } from './services/blogs/get';
import { updateBlog } from './services/blogs/update';
import { verifyToken } from './middleware';
import { createList } from './services/listFromPdf/create';
import { deleteBlogs } from './services/blogs/delete';

const router = express.Router();

// blogs api 
router.post('/blogs',verifyToken, createBlogs);
router.get('/blogs', verifyToken, getBlogsList);
router.get('/blogs/:id', verifyToken, getBlog)
router.put('/blogs/:id', verifyToken, updateBlog);
router.delete('/blogs-delete', verifyToken, deleteBlogs);

// getting list from pdf api
router.post('/list-pdf',verifyToken, createList);

// socket.io 
router.get('/', verifyToken, function(req, res) {
    res.render('index.html');
});

/**
 * Please don't remove this route
 */

export default router;
