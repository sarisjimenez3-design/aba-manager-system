import prisma from "../lib/prisma";
import { notifyUsersByRoles } from "./notification.service";

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
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const createPost = async (
  authorId: string,
  data: {
    title: string;
    content: string;
    imageUrl?: string;
  }
) => {
  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      imageUrl: data.imageUrl,
      authorId,
    },
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
  });

  await notifyUsersByRoles(
    ["ATHLETE", "PARENT", "ADMIN", "COACH"],
    "Nueva publicación del club",
    data.title,
    {
      type: "POST_CREATED",
      postId: post.id,
    }
  );

  return post;
};