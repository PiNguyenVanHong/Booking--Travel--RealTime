import { getChatById, updateChat } from "../services/chat.service.js";
import { createMessage } from "../services/message.service.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.sub;
  const chatId = req.params.chatId;
  const text = req.body.text;
  
  // After middleware rurn, it'll req.sub = token.id;
  if (!tokenUserId) {
    return res.status(403).json({ message: "Token User ID is required!!!" });
  }

  if (!chatId) {
    return res.status(403).json({ message: "Chat ID is required!!!" });
  }

  if (!text) {
    return res.status(403).json({ message: "Write some text before send!!!" });
  }
  try {
    const chat = await getChatById({ id: chatId, userId: tokenUserId, detail: false });

    if(!chat) {
      return res.status(404).json({ message: "Chat nout found!!!" });
    }

    const message = await createMessage({ text, chatId, userId: tokenUserId });

    await updateChat({ userId: tokenUserId, chatId, text, });

    return res.status(200).json({ message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to create message!" });
  }
};
