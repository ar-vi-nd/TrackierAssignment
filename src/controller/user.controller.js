import { ApiResponse } from "../utility/ApiResponse.js"
import { asyncHandler } from "../utility/asyncHandler.js"
import User from "../model/user.model.js"


const userRegister = asyncHandler(async(req,res)=>{

    return res.status(200).json(new ApiResponse(200,{},"User Registered Successfully"))

})
export const userSignup = asyncHandler(async(req,res)=>{

    const {fullName,email,password} = req.body
    
    console.log([fullName,email,password])
    
    if([fullName,email,password].some(element=>{
       return element? element.trim()==="":true})){
        throw new ApiError(400,"All fields are required")
    }
    
    const existingUser =await User.findOne({email})
    
    console.log("existingUser : ",existingUser)
    
    if(existingUser){
        throw new ApiError(400,"Username or email already exists")
    }
    
    const user = await User.create({
        fullName,
        email,
        password,
    })
    
    const createdUser = await User.findById(user._id).select("-password")
    
    if(!createdUser){
        throw new ApiError(400, "Something went wrong while creating user")
    
    }
    
    return res.status(200).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )
    
    
    })

export {userRegister}