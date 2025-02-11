import express from "express";
import { deleteUser, getUser, getUsers, updateUser, savePost, getProfilePosts, getNotifyNumber } from "../controllers/user.controller.js";
import Auth from "../middleware/auth.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/users/notification", Auth, getNotifyNumber);
// router.get("/user/:id", Auth, getUser);
router.get("/user/profilePosts", Auth, getProfilePosts);
router.post("/user/save", Auth, savePost);
router.put("/user/:id", Auth, updateUser);
router.delete("/user/:id", Auth, deleteUser);

export default router;