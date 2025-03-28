const adminCheck1=(req,res,next)=>{
    console.log(req.role);
    
          if(req.role=='Admin'){
              next();
          }
          else{
              res.status(400).send("You are not allowed")
          }
      }
      
      export default adminCheck1;