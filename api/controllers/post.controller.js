import prisma from "../lib/prisma.js";
import { createPost, getAllPost, getPostById } from "../services/post.service.js";

export const getPosts = async (req, res) => {
    try {
        const posts = await getAllPost(req);

        return res.status(200).json({ posts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get posts!"});
    }
}

export const getPost = async (req, res) => {
    const id = req.params?.id;

    if(!id) {
        return res.status(403).json({ message: "Post ID is required!"});
    }
    
    try {
        const post = await getPostById(id, res);

        return res.status(200).json({ post });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to get post!"});
    }
}

export const addPost = async (req, res) => {
    const body = req.body;
    const tokenUserId = req.sub;

    if(!body) {
        return res.status(403).json({ message: "Please fill all fields!" });
    }

    if(!tokenUserId) {
        return res.status(403).json({ message: "Unauthorized!" });
    }

    try {
        const post = await createPost(body, tokenUserId);

        return res.status(200).json({ post });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to add post!"});
    }
}

export const updatePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.sub;

    try {
        const post = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({ post });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to update post!"});
    }
}

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.sub;

    if(!id) {
        return res.status(403).json({ message: "Post ID is required!"});
    }

    if(!tokenUserId) {
        return res.status(403).json({ message: "Unauthorized!"});
    }

    try {
        const post = await getPostById(id, res);

        if(post.userId !== tokenUserId) {
            return res.status(403).json({ message: "Unauthorized! "});
        }

        const deletedPost = await prisma.post.delete({
            where: {
                id,
            },
        });

        console.log(deletedPost);
        

        return res.status(200).json({ message: "Delete Successfull" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete post!"});
    }
}