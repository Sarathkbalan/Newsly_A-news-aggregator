import {json, Router} from "express";
import authenticate from "../Middleware/auth.js";
import adminCheck1 from "../Middleware/admincheck.js";
import { sample} from "../model/sample.js";
import CustomNews from "../model/customNews.js";
import upload from "../Middleware/upload.js";
import { userauth } from "./Userauth.js";




    const adminauth=Router();
    const convertToBase64 = (buffer) => {
      return buffer.toString("base64")
    }


            adminauth.post("/addnews",authenticate,adminCheck1,upload.single("Newsimage"), async (req, res) => {
              try {
                const { title, description, url, categories } = req.body;

            
                if (!title || !description || !url || !categories) {
                  return res.status(400).json({ error: "Missing required news fields" });
                }

                let imageBase64 = null;
                if (req.file) {
                    console.log("File received", req.file);
                    imageBase64 = convertToBase64(req.file.buffer);
                    console.log("Base64 image created");
                }

              
                const customNews = new CustomNews({
                  title,
                  description,
                  url,
                  image: imageBase64,
                  categories
                });

              
                await customNews.save();

                res.status(201).json({ message: "Custom news added successfully", news: customNews });
              } catch (error) {
                console.error("Error adding custom news:", error);
                res.status(500).json({ error: "Failed to add custom news" });
              }
            });
            adminauth.get("/getAllCustomnews", async (req, res) => {
              try {
                
              const News=await CustomNews.find()
              if(News){
                res.status(200).json(News);
              }else{
              res.status(404).json("News not Founded");
               }
              } catch (error) {
                res.status(500).json({ error: "internal server error" });
              }
            });
       
            adminauth.delete("/delete",authenticate,adminCheck1, async (req, res) => {
              try {
                const { title } = req.body;
                if (!title) {
                  return res.status(400).json({ error: "Title is required" });
                }
            
                const deletedNews = await CustomNews.findOneAndDelete({ title });
                if (!deletedNews) {
                  return res.status(404).json({ error: "News not found" });
                }
            
                res.json({ message: "News deleted successfully", deletedNews });
              } catch (error) {
                console.error("Error deleting news:", error);
                res.status(500).json({ error: "Internal server error" });
              }
            });

 
             
              adminauth.put("/editnews", authenticate,adminCheck1, upload.single("Newsimage"), async (req, res) => {
                try {
                  const { title, newTitle, description, url, categories } = req.body;

                  if (!title) {
                    return res.status(400).json({ error: "Title is required to edit news" });
                  }

                  let updatedFields = {};
                  if (newTitle) updatedFields.title = newTitle;
                  if (description) updatedFields.description = description;
                  if (url) updatedFields.url = url;
                  if (categories) updatedFields.categories = categories;

                  if (req.file) {
                    console.log("File received", req.file);
                    updatedFields.image = convertToBase64(req.file.buffer);
                    console.log("Base64 image updated");
                  }

                  const updatedNews = await CustomNews.findOneAndUpdate({ title }, updatedFields, { new: true });

                  if (!updatedNews) {
                    return res.status(404).json({ error: "News not found" });
                  }

                  res.json({ message: "News updated successfully", updatedNews });
                } catch (error) {
                  console.error("Error updating news:", error);
                  res.status(500).json({ error: "Internal server error" });
                }
              });






            




          adminauth.get("/categories",authenticate,adminCheck1, async (req, res) => {


              try {
                const name=req.query.Name  
                const user = await sample.findOne({Username:name})
                if (!user) {
                  return res.status(404).json({ error: "User not found" });
                }
                
                res.status(200).json({
                  categories: [
                    "sports",
                    "entertainmeUsernt",
                    "technology",
                    "health",
                    "science",
                    "general",
                    "business",
                  ],
                  selectedCategories: user.Categories,
                });
              } catch (error) {
                console.error("Error fetching user categories:", error);
                res.status(500).json({ error: "Error fetching user categories" });
              }
            });
            


            adminauth.put('/updatecategories', authenticate, adminCheck1, async (req, res) => {
              try {
                  const { Name } = req.query;
                  
                  
                  const user = await sample.findOne({ Username: Name });
                  if (!user) {
                      return res.status(404).json({ error: "User not found" });
                  }
          
                  
                  const updatedUser = await sample.findOneAndUpdate(
                      { Username: Name },
                      { $set: req.body }, 
                      { new: true }
                  );
                  
          
                  if (updatedUser) {
                      console.log(updatedUser);
                      await updatedUser.save()
                      res.status(200).json({ message: "Update successful", user: updatedUser });
                  } else {
                      res.status(400).json({ error: "Bad Request" });
                  }
                  
                
              } catch (error) {
                  console.error(error);
                  res.status(500).json({ error: "Internal Server Error" });
              }
          });


          

            adminauth.get('/news', authenticate, adminCheck1, async (req, res) => {
              try {
                  const { Name } = req.query;
                  
                 
                  const user = await sample.findOne({ Username: Name });
                  if (!user) return res.status(404).json({ error: "User not found" });

                 
                  const newsArticles = await CustomNews.find({ category: { $in: user.Categories || [] } });

                  res.status(200).json({ articles: newsArticles });
              } catch (error) {
                  res.status(500).json({ error: "Internal Server Error" });
              }
            });

            adminauth.post("/bookmark", authenticate, async (req, res) => {
              try {
                const { Name } = req.query;
                const { article } = req.body;

                
                if (!article || !article.title || !article.url) {
                  return res.status(400).json({ error: "Invalid article data" });
                }

                
                const user = await sample.findOne({ Username: Name });
                if (!user) return res.status(404).json({ error: "User not found" });

               
                if (!user.Bookmarks) user.Bookmarks = [];

              
                user.Bookmarks.push(article);
                await user.save();

                res.status(201).json({ message: "Article bookmarked successfully", bookmarks: user.Bookmarks });
              } catch (error) {
                console.error("Bookmark Error:", error);
                res.status(500).json({ error: "Failed to bookmark article" });
              }
            });
            adminauth.get("/bookmarks",authenticate, async (req, res) => {
              try {
                const { Name } = req.query; 

                if (!Name) {
                  return res.status(400).json({ error: "Username is required" });
                }

              
                const user = await sample.findOne({ Username: Name });

                if (!user) return res.status(404).json({ error: "User not found" });

                res.status(200).json({ bookmarks: user.Bookmarks || [] });
              } catch (error) {
                console.error("Fetch Bookmarks Error:", error);
                res.status(500).json({ error: "Failed to fetch bookmarks" });
              }
            });
            
            adminauth.delete("/bookmark", authenticate, async (req, res) => {
              try {
                const { Name } = req.query;
                const { title } = req.body;
            
                if (!Name || !title) {
                  return res.status(400).json({ error: "Username and article title are required" });
                }
            
                const user = await sample.findOne({ Username: Name });
                if (!user) return res.status(404).json({ error: "User not found" });
            
                if (!user.Bookmarks || user.Bookmarks.length === 0) {
                  return res.status(404).json({ error: "No bookmarks found" });
                }
            
                const updatedBookmarks = user.Bookmarks.filter(article => article.title !== title);
            
                if (updatedBookmarks.length === user.Bookmarks.length) {
                  return res.status(404).json({ error: "Article not found in bookmarks" });
                }
            
                user.Bookmarks = updatedBookmarks;
                await user.save();
            
                res.status(200).json({ message: "Article removed from bookmarks", bookmarks: user.Bookmarks });
              } catch (error) {
                console.error("Delete Bookmark Error:", error);
                res.status(500).json({ error: "Failed to delete bookmark" });
              }
            });               
               

                  export default adminauth
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  