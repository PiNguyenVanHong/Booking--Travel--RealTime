import prisma from "../lib/prisma.js";
import { getUserById } from "./user.service.js";

export const getAllChat = async ({ userId }) => {
  const chats = await prisma.chat.findMany({
    where: {
      userIds: {
        hasSome: [userId],
      },
    },
  });

  // Dùng NOT thử xem chỗ này thế nào

  for (const chat of chats) {
    const receiverId = chat.userIds.find((id) => id !== userId);

    const receiver = await getUserById({ id: receiverId });

    chat.receiver = receiver;
  }

  return chats;
};

export const getChatById = async ({ id, userId, detail }) => {
  let chat;

  if (detail) {
    chat = await prisma.chat.findUnique({
      where: {
        id,
        userIds: {
          hasSome: [userId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    await prisma.chat.update({
      where: {
        id,
      },
      data: {
        seenBy: {
          push: [userId],
        },
      },
    });
  } else {
    chat = await prisma.chat.findUnique({
      where: {
        id,
        userIds: {
          hasSome: [userId],
        },
      },
    });
  }

  return chat;
};

export const sendChat = async ({ userId, receiverId }) => {
  const newChat = await prisma.chat.create({
    data: {
      userIds: [userId, receiverId],
    },
  });

  return newChat;
};

export const seenChat = async ({ userId }) => {
  const updatedChat = await prisma.chat.update({
    where: {
      id: chatId,
    },
    data: {
      seenBy: [userId],
    },
  });

  updatedChat = await prisma.chat.update({
    where: {
      id,
      userIds: {
        hasSome: [userId],
      },
    },
    data: {
      seenBy: {
        set: [userId],
      },
    },
  });

  return updatedChat;
};

export const updateChat = async ({ chatId, userId, text }) => {
  const updatedChat = await prisma.chat.update({
    where: {
      id: chatId,
    },
    data: {
      seenBy: [userId],
      lastMessage: text,
    },
  });

  return updatedChat;
};

export const getChatNumberById = async ({ userId }) => {
  const number = await prisma.chat.count({
    where: {
      userIds: {
        hasSome: [userId],
      },
      NOT: {
        seenBy: {
          hasSome: [userId],
        },
      },
    },
  });

  return number;
};
