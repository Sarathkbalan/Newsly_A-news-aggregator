import {Schema} from "mongoose";
import { model } from "mongoose";

const CommentSchema = new Schema({
  newsId: { type:Schema.Types.ObjectId, ref: "CustomNews", required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Comment = model("Comment", CommentSchema);

export default Comment;