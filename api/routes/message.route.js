import express from "express";
import Auth from "../middleware/auth.js";
import { addMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/:chatId", Auth, addMessage);

export default router;