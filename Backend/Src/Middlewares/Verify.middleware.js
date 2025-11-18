import {ApiError} from "../utilities/apiError.js"
import {User} from "../Models/User.model.js";
import {asyncHandler} from "../utilities/asyncHandler.js"
import jwt from 'jsonwebtoken'

export const verifyUser = asyncHandler(async(req,res,next)=>{
  
  try{
    const token = req.cookies.accessToken || req.header("authorization")?.replace("Bearer ", "")
    
      const decodedUser = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      
      const user = await User.findById(decodedUser?._id).select("-password -refreshToken")
      
      if(!user){
        throw new ApiError(400, "Token is not valid or expired")
      }
      
      req.user = user;
      
      next()
  }catch(error){
    throw new ApiError(400, error?.message || "access is invalid")
  }
})