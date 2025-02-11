import express from "express";
import Auth from "../middleware/auth.js";
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/posts", getPosts);
router.get("/post/:id", getPost);
router.post("/post", Auth, addPost);
router.put("/post/:id", Auth, updatePost);
router.delete("/post/:id", Auth, deletePost);

export default router;