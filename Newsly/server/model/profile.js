import { Schema } from "mongoose";
import { model } from "mongoose";


const profilepicture = new Schema({
          Name:{type:String ,required:true},
          Username: { type: String, required: true,unique: true  },
          Email: { type: String, required: true, },
          Categories: { type: [String], required: true },
          image:{type: String},
     });
     const profile =model("profile", profilepicture);
     export default profile