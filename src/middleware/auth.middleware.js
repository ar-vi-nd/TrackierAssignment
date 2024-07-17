import User from "../model/user.model.js"
import { ApiError } from "../utility/ApiError.js"
import { asyncHandler } from "../utility/asyncHandler.js"
import jwt from "jsonwebtoken"
export const verifyjwt = asyncHandler(async (req,res,next)=>{

    // console.log(Object.keys(req.cookies))
    // console.log(req)

    const token = req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
    // console.log(token)

    if(!token){
        return res.status(400).json(new ApiError(400, "Unauthorized Access"));
    }

    // console.log(token)

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

    // console.log(decodedToken)

    const user = await User.findOne({_id : decodedToken?._id}).select("-password")

    if(!user){
        return res.status(400).json(new ApiError(400, "Unauthorized Access"));
    }

    req.user =  user
    next()
    
})