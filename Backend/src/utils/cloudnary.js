import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.API_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
 });

const uploadonc=async (localfilepath)=>{
    try {
        if(!localfilepath) return null;
       const responce=await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"
        })
        console.log("done uploading",responce.url);
        fs.unlinkSync(localfilepath)
        return responce
    } catch (error) {
            fs.unlinkSync(localfilepath)
            return null;
    }
}

export {uploadonc}

