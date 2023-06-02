/**
 * @file Defines queries for the customer_invitation_access table
 */

import { sql } from 'slonik';
import globalDb from '..';
import { createPdfInfo } from '../../model'

const getPdfInfoById = async (id: string) => {
    const query = sql`SELECT * FROM pdf_infos WHERE id = ${id}`;

    const connection = await globalDb;
    return await connection.any(query);
};

const getPdfInfos = async () => {
    const query = sql`SELECT * FROM pdf_infos`;

    const connection = await globalDb;
    return await connection.any(query);
};

const insertPdfInfo = async (data: createPdfInfo) => {
    const {id, title, author, producer, pages, file_size, pdf_version, summary, createAt = '', updateAt} = data;
    const query = sql`INSERT INTO pdf_infos (id, title, author, producer, pages, file_size, pdf_version, summary, file_name, createat, updateat) 
    VALUES (${id}, ${title}, ${author}, ${producer}, ${pages}, ${file_size}, ${pdf_version}, ${summary} ${createAt}, ${updateAt})`;

    const connection = await globalDb;
    return await connection.any(query);
};

const deletePdfInfoById = async(id: string) => {
    const query = sql`DELETE FROM pdf_infos WHERE id = ${id}`;

    const connection = await globalDb;
    return await connection.any(query);
}


export default {
    getPdfInfos,
    getPdfInfoById,
    insertPdfInfo,
    deletePdfInfoById
};
