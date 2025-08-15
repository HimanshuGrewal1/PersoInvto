import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../modles/User.modle.js"
import { uploadonc } from "../utils/cloudnary.js";
import { ApiResponce } from "../utils/Apiresponce.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const generateAccessAndRefreshtoken=async(userId)=>{
   try {
      const user=await User.findById(userId)
      const accessToken=user.generateAccesstoken()
      const refreshToken=user.generateRefreshtoken()

      user.refreshToken=refreshToken
      await user.save({validateBeforeSave:false})
      return {accessToken,refreshToken}
   } catch (error) {
      throw new ApiError(500,"something went wrong while generating refresh token")
   }
}


const registerUser = asynchandler(async (req, res) => {

   const {fullname, email, username, password } = req.body
   console.log(email, username, password, fullname)

   if ([fullname, email, username, password].some((field) =>
      field?.trim() === "")
   ) {
      throw new ApiError(400, "All fields are required")
   }


   const existUser = await User.findOne({
      $or: [{ username }, { email }]
   })

   if (existUser) {
      throw new ApiError(409, "User with email or username already exist!")
   }

   let coverImageLocalPath;
   const avatarLocalPath = req.files?.avatar[0]?.path;
   if(req.field && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
      coverImageLocalPath = req.files?.coverImage[0]?.path;
   }
   
   if (!avatarLocalPath) {
      throw new ApiError(400, "NO Avatar Image found");

   }


   const avatar = await uploadonc(avatarLocalPath);
   const coverImage = await uploadonc(coverImageLocalPath)

   if (!avatar){
      throw new ApiError(400, "NO Avatar Image found");
   }
   const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
   })

   const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
   )

   if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the User")
   }



   return res.status(201).json(
      new ApiResponce(200, createdUser, "User registered Successfully")
   )

})

const loginUser= asynchandler(async (req,res)=>{
    const{email,username,password} = req.body

   

    if(!username && !email){
        throw new ApiError(400,"Username or email is required")

    }

    const existUser = await User.findOne({
      $or: [{ username },{email}]
   })
   
   if (!existUser) {
      throw new ApiError(404,"User not found")
   }
   

   const passwordc=await existUser.ispasswordcorrect(password)
   
   if(!passwordc){
      throw new ApiError(401,"Invalid user credentials")
   }
   
   const {accessToken,refreshToken}=await generateAccessAndRefreshtoken(existUser._id)

   const loggedUser=await User.findById(existUser._id).select("-password -refreshToken")

   const options={
      httpOnly:true,
      secure:true
   }

   return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponce(200,{user:loggedUser,accessToken,refreshToken},"User loggen In successfully"))
})

const logoutUser=asynchandler(async (req,res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
         $unset:{
            refreshToken:1
         }
    },
     {
        new:true
     }
   )
   
   const options={
      httpOnly:true,
      secure:true
   }

   return res.status(200).clearcookie("accessToken",options).clearcookie("refreshToken",options).json(new ApiResponce(200,{},"User logged Out Successfully"))

})

const refershAccessToken=asynchandler(async (req,res) => {
      const incomingrefreshToken=req.cookie.refreshToken || req.body.refreshToken

      if(!incomingrefreshToken){
         throw new ApiError(401,"unauthorized request");
      }
      const decodedtoken=jwt.verify(incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET)
      const user=await User.findById(decodedtoken?._id)

      if(!user){
         throw new ApiError(401,"invalid refresh token");
      }

      if(incomingrefreshToken !== user?.refreshToken){
         throw new ApiError(401,"refresh token is expired or used");
      }

      const options={
         httpOnly:true,
         secure:true
      }

      const {accessToken,newrefreshToken}=await generateAccessAndRefreshtoken(user._id)

      return res.status(201).cookie("accessToken",accessToken,options).cookie("refreshToken",newrefreshToken,options).json(new ApiResponce(200,{accessToken,refreshToken:newrefreshToken},"AccessToken refreshed "))
})

const changeCurrentPassword=asynchandler(async (req,res) => {
    const {oldpassword,newPassword}=req.body
   
    const user = await user.findById(req?.user?._id)
    const ispasswordcorrect = await user.ispasswordcorrect(oldpassword)

    if(!ispasswordcorrect){
      throw new ApiError(400,"Invalid password");
      
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})

    return res.status(200).json(new ApiResponce(200,"password updated successfully"))
})

const getCurrentUser = asynchandler(async (req,res) => {
   return res.status(200).json(new ApiResponce(200,"current user fetched successfully"))

})

const updateAccountDetails=asynchandler(async (req,res) => {
   const {fullname,email}=req.body

   if(!fullname || !email){
      throw new ApiError(400,"All fields are required");
   }

  const user=await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set:{
            fullname,
            email:email
         }
      },
      {new:true}
   ).select("-password -refreshToken")

   return res.status(200).json(new ApiResponce(200,user,"account updated successfully"))

})

const updateuseravatar = asynchandler(async (req,res) => {
   const avatarLocalPath= req.file?.path

   if(!avatarLocalPath){
      throw new ApiError(400,"Avatar file is missing");
   }

   const avatar=await uploadonc(avatarLocalPath)

   if(!avatar.url){
      throw new ApiError(400,"Error in uploading file");
   }

  const user= await User.findByIdAndUpdate(
      req.user._id,
      {
         avatar:avatar.url
      },
      {
         new:true
      }
   ).select("-password -refreshToken")

   return res.status(200).json(new ApiResponce(200,user,"Avatar updated successfully"))



})

const updateusercoverimage = asynchandler(async (req,res) => {
   const CIPath= req.file?.path

   if(!CIPath){
      throw new ApiError(400,"CoverImage file is missing");
   }

   const CI =await uploadonc(CIPath)

   if(!CI.url){
      throw new ApiError(400,"Error in uploading file");
   }

   const user= await User.findByIdAndUpdate(
      req.user._id,
      {
         coverImage:CI.url
      },
      {
         new:true
      }
   ).select("-password -refreshToken")

    return res.status(200).json(new ApiResponce(200,user,"CoverImange  updated successfully"))


})





export {registerUser,loginUser,logoutUser,refershAccessToken,getCurrentUser,changeCurrentPassword,updateAccountDetails,updateusercoverimage,updateuseravatar,}