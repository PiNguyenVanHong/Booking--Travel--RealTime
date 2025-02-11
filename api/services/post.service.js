import prisma from "../lib/prisma.js";

export const createPost = async ({ postData, postDetail }, tokenUserId) => {
    const post = await prisma.post.create({
        data: {
            ...postData,
            userId: tokenUserId,
            postDetail: {
                create: postDetail,
            },
        },
    });

    return post;
}

export const getPostById = async (id, res) => {
    const post = await prisma.post.findUnique({
        where: {
            id,
        },
        include: {
            postDetail: true,
            user: {
                select: {
                    username: true,
                    avatar: true,
                }
            },
            savedPost: {
                select: {
                    userId: true,
                }
            }
        },
    });

    if(!post) {
        return res.status(403).json({ message: "Post not found!"}); 
    }
    return post;
};

export const getPostByUserId = async ({ userId, }) => {
    const posts = await prisma.post.findMany({
        where: {
            userId,
        },
    });

    if(!posts) {
        return res.status(403).json({ message: "Post not found!"}); 
    }
    return posts;
};

export const getAllPost = async (req) => {
    const { 
        type, 
        city, 
        property,
        bedroom,
        minPrice, 
        maxPrice,
    } = req.query;

    const posts = await prisma.post.findMany({
        where: {
            city: city || undefined,
            type: type?.toString()?.toUpperCase() || undefined,
            property: property?.toString()?.toUpperCase() || undefined,
            bedroom: parseInt(bedroom) || undefined,
            price: {
                gte: parseInt(minPrice) || 0,
                lte: parseInt(maxPrice) || 10000000,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return posts;
}