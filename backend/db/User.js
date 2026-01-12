import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatarUrl: {
    default: "",
    type: String,
    required: false
  },
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: []
  },
  friendRequests: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: "User",
    default: []
  },
  groups: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Group",
    default: []
  }
});

export const User = mongoose.model("User", userSchema);
