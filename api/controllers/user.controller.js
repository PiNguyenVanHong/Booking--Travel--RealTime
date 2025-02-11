import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import { savedPostService } from "../services/user.service.js";
import { getPostByUserId } from "../services/post.service.js";
import { getSavedPostByUserId } from "../services/savedPost.service.js";
import { getChatNumberById } from "../services/chat.service.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(403).json({ message: "User ID is required!!!" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get user!" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const tokenUserId = req.sub;

    if (!id) {
      return res.status(403).json({ message: "User ID is required!!!" });
    }

    // After middleware rurn, it'll req.sub = token.id;
    if (!tokenUserId) {
      return res.status(403).json({ message: "Token User ID is required!!!" });
    }

    if (id !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    const { password, avatar, ...data } = req.body;
    let hashUpdatedPassword = null;

    if (password) {
      hashUpdatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
        ...(hashUpdatedPassword && { password: hashUpdatedPassword }),
        ...(avatar && { avatar }),
      },
      select: {
        username: true,
        email: true,
        avatar: true,
      },
    });

    res.status(200).json({ message: "Update Completely!!!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update users!" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const tokenUserId = req.sub;

    if (!id) {
      return res.status(403).json({ message: "User ID is required!!!" });
    }

    // After middleware rurn, it'll req.sub = token.id;
    if (!tokenUserId) {
      return res.status(403).json({ message: "Token User ID is required!!!" });
    }

    if (id !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "User deleted!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete users!" });
  }
};

export const savePost = async (req, res) => {
  const tokenUserId = req.sub;

  // After middleware rurn, It'll req.sub = token.id;
  if (!tokenUserId) {
    return res.status(403).json({ message: "Token User ID is required!!!" });
  }

  try {

    const postId = req.body.postId;

    if (!postId) {
      return res.status(403).json({ message: "Post ID is required!" });
    }

    const response = await savedPostService({ userId: tokenUserId, postId });

    if (response) {
      return res.status(200).json({ message: "Post removed from saved list!!" });
    }

    return res.status(200).json({ message: "Post saved!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to save post!" });
  }
};

export const getProfilePosts = async (req, res) => {
  const tokenUserId = req.sub;

  // After middleware rurn, It'll req.sub = token.id;
  if (!tokenUserId) {
    return res.status(403).json({ message: "Token User ID is required!!!" });
  }

  try {

    const userPosts = await getPostByUserId({ userId: tokenUserId });

    const savedPost = await getSavedPostByUserId({ userId: tokenUserId});
    const userSavedPosts = savedPost.map((item) => item.post);
    
    return res.status(200).json({ userPosts, userSavedPosts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to save post!" });
  }
}

export const getNotifyNumber = async (req, res) => {
  const tokenUserId = req.sub;

  // After middleware rurn, It'll req.sub = token.id;
  if (!tokenUserId) {
    return res.status(403).json({ message: "Token User ID is required!!!" });
  }

  try {
    const data = await getChatNumberById({ userId: tokenUserId });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get notification!" });
  }
}
