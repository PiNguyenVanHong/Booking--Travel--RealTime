import prisma from "../lib/prisma.js";

export const getSavedPostByUserId = async ({ userId, }) => {
    const savedPosts = await prisma.savedPost.findMany({
        where: {
            userId,
        },
        include: {
            post: true,
        },
    });

    if(!savedPosts) {
        return res.status(403).json({ message: "User doesn't save any post!"}); 
    }
    return savedPosts;
};