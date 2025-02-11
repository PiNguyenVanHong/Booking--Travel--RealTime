import express from "express";
import Auth from "../middleware/auth.js";
import { addChat, getChat, getChats, readChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/", Auth, getChats);
router.get("/:id", Auth, getChat);
router.post("/", Auth, addChat);
router.put("/read/:id", Auth, readChat);

export default router;