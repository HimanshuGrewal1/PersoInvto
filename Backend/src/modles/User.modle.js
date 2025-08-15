 import mongoose,{Schema} from "mongoose";
 import jwt from "jsonwebtoken";
 import bcrypt from "bcrypt"

 const userschema=new Schema( 
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            index:true
        },
     
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,
            required:true,
        },
        coverimage:{
            type:String,
          
        },
        customCategories: {
            type: [String], 
            default: [],
        },
        password:{
            type:String,
            required:[true,'Password is required']
        },
        refershToken:{
            type:String
        }

 },{
    timestamps:true
 }
)

userschema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();

    this.password= await bcrypt.hash(this.password,10)
    next()
})

userschema.methods.ispasswordcorrect=async function (password) {
  return  await bcrypt.compare(password,this.password)
    
}

userschema.methods.generateAccesstoken= function () {
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname

        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
      
  }

  userschema.methods.generateRefreshtoken= function () {
    return jwt.sign(
         {
             _id:this._id,
         },
         process.env.REFRESH_TOKEN_SECRET,
         {
             expiresIn:process.env.REFRESH_TOKEN_EXPIRY
         }
     )
       
   }


export const User=mongoose.model("User",userschema)