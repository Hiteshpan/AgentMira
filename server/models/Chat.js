import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "User", required: true },
    userName: { type: String, required: true },
    name: { type: String, required: true },
    messages: [
      {
        role: { type: String, required: true },
        type: { type: String, default: "text" }, // 👈 ADD THIS
        content: { type: mongoose.Schema.Types.Mixed }, // 👈 IMPORTANT
        properties: { type: Array }, // 👈 for property cards
        timestamp: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
