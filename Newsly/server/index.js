import express,{json} from 'express';
import dotenv from 'dotenv'
import { userauth } from './Router/Userauth.js';
import adminauth from './Router/adminauth.js';
import apicall from "./Router/apicall.js";
import mongoose from 'mongoose';
import  cors from "cors";


dotenv.config();
const app=express();

app.use(json())

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);


app.use("/",userauth);
app.use("/", apicall);
app.use("/",adminauth);




 mongoose.connect("mongodb://mongodb:27017/NEWSAGGREGATOR").then(()=>
 {console.log("mongoDB connected sucessfully to NEWSAGGREGATOR")})

 .catch((error)=>{
    console.error("MongoDB connection failed",error)

 })
app.listen(process.env.PORT,function(){
    console.log(`server is listening at ${process.env.PORT}`);
 
});

