export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  author?: {
    firstName: string;
    lastName: string;
    role: string;
  };
}