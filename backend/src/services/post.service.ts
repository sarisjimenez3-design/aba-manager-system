import prisma from "../lib/prisma";

export const getPosts = async () => {
  return prisma.post.findMany({
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const createPost = async (
  authorId: string,
  data: { title: string; content: string }
) => {
  return prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      authorId,
    },
  });
};