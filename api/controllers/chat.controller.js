import { getAllChat, getChatById, seenChat, sendChat } from "../services/chat.service.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.sub;

  // After middleware rurn, it'll req.sub = token.id;
  if (!tokenUserId) {
    return res.status(403).json({ message: "Token User ID is required!!!" });
  }

  try {
    const chats = await getAllChat({ userId: tokenUserId });

    return res.status(200).json({ chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.sub;
  const id = req.params.id;

  if (!tokenUserId) {
    return res.status(403).json({ message: "Token User ID is required!!!" });
  }
  try {
    const chat = await getChatById({ id, userId: tokenUserId, detail: true });

    return res.status(200).json({ chat });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get users!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.sub;
  const receiverId = req.body.receiverId;

  // After middleware rurn, it'll req.sub = token.id;
  if (!tokenUserId) {
    return res.status(403).json({ message: "Token User ID is required!!!" });
  }

  if (!receiverId) {
    return res.status(403).json({ message: "Receviver ID is required!!!" });
  }
  try {
    const data = await sendChat({ userId: tokenUserId, receiverId });

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get users!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.sub;

  if (!tokenUserId) {
    return res.status(403).json({ message: "Token User ID is required!!!" });
  }
  try {
    const data = await seenChat({ userId: tokenUserId });
    
    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get users!" });
  }
};
