import {Router} from "express";
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken";
import dotenv from "dotenv";
import {sample} from "../model/sample.js";
import upload from "../Middleware/upload.js";
import authenticate from "../Middleware/auth.js";
import profile from "../model/profile.js";
import cookieParser from "cookie-parser";
import adminCheck1 from "../Middleware/admincheck.js";






dotenv.config();
const userauth=Router();
userauth.use(cookieParser());

const convertToBase64 = (buffer) => {
    return buffer.toString("base64")
}


userauth.post("/signup", upload.single("profilepicture"), async (req, res) => {
    try {
        const { username, password, email, userType, categories, name } = req.body;

        const existingUser = await sample.findOne({ Username: username });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).send("User already exists");
        }

        let imageBase64 = null;
        if (req.file) {
            console.log("File received", req.file);
            imageBase64 = convertToBase64(req.file.buffer);
            console.log("Base64 image created");
        }

        const newPassword = await bcrypt.hash(password, 10);

        const result = new sample({
            Name: name,
            Username: username,
            Email: email,
            UserType: userType,
            Password: newPassword,
            Categories: categories,
            image: imageBase64
        });

        console.log(result);
        await result.save();

        const newProfile = new profile({
            Name: result.Name,
            Username: result.Username,
            Email: result.Email,
            Categories: result.Categories,
            image: result.image
        });

        console.log(newProfile);
        await newProfile.save();

        console.log("Signup successful");
        res.status(201).send("Signup successful");
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).send("Internal Server Error");
    }
});



userauth.post('/login',async(req,res)=>{
    try{    
        const {username,password}=req.body;
        const result =await sample.findOne({Username:username})
         console.log(result);
        
        if(!result){
            res.status(400).send("Enter a valid username");
        }
        else{
           
            const valid =await bcrypt.compare(password,result.Password);
            console.log(valid);
            if(valid){
                const token = jwt.sign({username:username,UserType:result.UserType} ,process.env.SECRET_KEY);
                console.log(token);
                
                res.cookie("authToken",token,
                {
                 httpOnly:true
                });
                res.status(200).json({message:"Logged in successfully"});
              
                
            }
            else{

                res.status(401).send("Unauthorized access");

            }}
    }
    catch{
        res.status(500).send("Internal Server Error")
    }
})
userauth.get('/checkauthentication',(req,res)=>{
    try{
        console.log("hi");
        const token=req.cookies.authToken;
        console.log("token name:",token);
        
        
        if(!token){
            return res.status(401).json({isLoggedIn:false})
        }
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json("token not found");
            }
            console.log(decoded.username);
            
            res.status(200).json({ Username: decoded.username ,Usertype:decoded.UserType});
        });

    }catch(error){
        console.error('Error in checking authentication in (NAVBAR)')
    }
})


userauth.get('/profile/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const userProfile = await profile.findOne({ Username: username });
        if (!userProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(userProfile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

userauth.put("/editprofile", upload.single("image"), async (req, res) => {
    try {
        const { Username, Name, Email, Categories } = req.body;
        let updatedFields = { Name, Email, Categories: Categories.split(",") };

        if (req.file) {
            updatedFields.image = req.file.buffer.toString("base64"); // Convert image to base64
        }

        const updatedProfile = await profile.findOneAndUpdate(
            { Username },
            updatedFields,
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", updatedProfile });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
userauth.delete("/deleteprofile", async (req, res) => {
    try {
        const { Username } = req.body;
        const deletedProfile = await profile.findOneAndDelete({ Username });

        if (!deletedProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ message: "Server error", error });
    }
});


           



        userauth.get("/logout",(req,res)=>{
            res.clearCookie("authToken");
            res.status(200).send("sucessfully logged out")
            console.log("Logout successful");

        })
        
        export{userauth};