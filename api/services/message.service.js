import prisma from "../lib/prisma.js";

export const createMessage = async ({ text, chatId, userId }) => {
    const message = await prisma.message.create({
        data: {
            text,
            chatId,
            userId,
        },
    });

    return message
}