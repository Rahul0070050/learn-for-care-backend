export type blogBody = {
  blog_id?: string;
  header: string;
  content: string;
  image?: string;
};

export type updateBlogBody = {
  blog_id: string;
  image: string;
}