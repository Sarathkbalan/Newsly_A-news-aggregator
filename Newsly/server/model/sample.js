import { Schema } from "mongoose";
import { model } from "mongoose";


const userSchema = new Schema({
  Name:{type:String ,required:true},
  Username: { type: String, required: true,unique: true },
  Password: { type: String, required: true, minlength: 8 },
  Email: { type: String, required: true,  },
  UserType: { type: String, required: true },
  Categories: { type: [String], required: true },
  image:{type: String},
  Bookmarks: {
    type: [
      {
        title: { type: String, required: true },
        description: String,
        url: { type: String, required: true },
        urlToImage: String,
      },
    ],
    default: [],
  },
});

const sample =model("users", userSchema);


export {sample}

