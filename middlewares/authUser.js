const jwt=require("jsonwebtoken")

const authorizeUser=((req,res,next)=>{
    let authHeader=req.headers.authorization
    if(authHeader==undefined){
        res.status(401).json({
            message:"no token provided"
        })
    }


    let token=authHeader.split(" ")[1]
     jwt.verify(token,process.env.SECRET_KEY_USER,(err)=>{
        if(err){
            return res.status(403).json({
                message:"failure",
                data:err.message
            })
        }
            next()
        
     })

})



module.exports=authorizeUser