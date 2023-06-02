/**
 * @file Defines queries for the customer_invitation_access table
 */

 import { sql } from "slonik";
 // import { MaybeClientCustomer } from 'app/models';
 import globalDb from "..";
 import { CreateBlogs } from "../../model"

const getBlogsById = async (id: string) => {
  const query = sql`SELECT * FROM blogs WHERE id = ${id}`;

  const connection = await globalDb;
  return await connection.any(query);
};

const getBlogs = async () => {
  const query = sql`SELECT * FROM blogs`;

  const connection = await globalDb;
  return await connection.any(query);
};

const createBlog = async (data: CreateBlogs) => {
  const {id, title, content, createAt = "", updateAt} = data;
  const query = sql`INSERT INTO blogs (id, title, content, createat, updateat) VALUES (${id}, ${title}, ${content}, ${createAt}, ${updateAt})`;

  const connection = await globalDb;
  return await connection.any(query);
};

const updateBlogById = async (data: CreateBlogs) => {
  const {id, title, content, updateAt} = data;
  const query = sql`UPDATE blogs SET title = ${title}, content = ${content}, updateat = ${updateAt} WHERE id = ${id}`;

  const connection = await globalDb;
  return await connection.any(query);
};

const deleteBlogById = async(id: string) => {
  const query = sql`DELETE FROM blogs WHERE id = ${id}`;

  const connection = await globalDb;
  return await connection.any(query);
}

export default {
  createBlog,
  getBlogs,
  getBlogsById,
  updateBlogById,
  deleteBlogById
};
