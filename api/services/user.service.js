import prisma from "../lib/prisma.js";

export const getUserById = async ({ id }) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  });
  return user;
};

export const savedPostService = async ({ userId, postId }) => {
  const savedPost = await prisma.savedPost.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });

  if (savedPost) {
    await prisma.savedPost.delete({
      where: {
        id: savedPost.id,
      },
    });

    return true;
  } else {
    await prisma.savedPost.create({
      data: {
        userId,
        postId,
      },
    });

    return false;
  }
};
