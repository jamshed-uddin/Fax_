const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    chatDescription: { type: String, trim: true },
    chatPhotoURL: { type: String },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

chatSchema.pre("save", async function (next) {
  if (!this.isGroupChat) {
    next();
  }

  this.chatPhotoURL = "https://i.ibb.co/mz6J26q/usergroup.png";
});

module.exports = mongoose.model("Chat", chatSchema);
