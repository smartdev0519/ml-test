export interface CreateBlogs {
    id: string,
    title: string,
    content: string,
    createAt?: string,
    updateAt: string
}

export interface createPdfInfo {
    id: string,
    title: string,
    author: string,
    producer: string,
    pages: string,
    file_size: string,
    pdf_version: string,
    summary: string,
    file_name: string,
    createAt?: string,
    updateAt: string
}