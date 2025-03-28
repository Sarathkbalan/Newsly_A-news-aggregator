import {Schema} from "mongoose";
import { model } from "mongoose";
const customNewsSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  image:{type: String},
  categories: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


customNewsSchema.index({ title: "text", description: "text" });

const CustomNews =model("customnews", customNewsSchema);

export  default CustomNews;
