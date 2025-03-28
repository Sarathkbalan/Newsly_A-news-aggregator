import jwt from "jsonwebtoken";

const authenticate=(req,res,next)=>{
    const cookie=req.headers.cookie;
    console.log(cookie);
    
    if(!cookie){
        console.log("please login")
        res.status(401).send('please login to continue')
    }
    else{

    console.log(cookie);
    const[name,token]=cookie.trim().split('=');
    console.log(name);
    console.log(token);
    if(name=='authToken'){
    const verified=jwt.verify(token,process.env.SECRET_KEY)
    //    check if login member try to make change by admin verify
        console.log(verified);
        req.user=verified.username
        req.role=verified.UserType
        next(); //  back to the route


    }
    else{
        res.status(401).send('error')
      

    }
}
}
export default authenticate;