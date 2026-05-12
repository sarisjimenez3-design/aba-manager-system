export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author?: {
    firstName: string;
    lastName: string;
    role: string;
  };
}