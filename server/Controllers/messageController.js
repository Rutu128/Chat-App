const messageModel = require("../Models/messageModel");

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  try {
    const message = new messageModel({
      chatId,
      senderId,
      text,
    });
    
    const response = await message.save();
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error", error);
  }
};

const getMessages = async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const messages = await messageModel.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error", error);
  }
};

module.exports = {
  createMessage,
  getMessages,
};
