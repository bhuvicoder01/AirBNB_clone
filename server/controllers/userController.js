const userModel = require("../models/User")
const cloudinary = require("../services/cloudinary")

class userController{
    static updateProfile=async (req,res) => {
try{
    if(!req.body){
        return res.status(400).json({message:"No request is found"})
    }
        const { firstName,lastName,email}=req?.body
        // console.log(req.file)
        const id=req.params.id
        const avatar=req.file
        // console.log(avatar)
        if(avatar){
             const result=await cloudinary.uploader.upload(avatar.path,{folder:'avatars'})
        await userModel.updateOne({_id:id},
            {$set:{firstName,lastName,email,avatar:{public_id:result?.public_id,url:result?.secure_url}}}, 
            { upsert: false })
        }
        await userModel.updateOne({_id:id},
            {$set:{firstName,lastName,email}}, 
            { upsert: false })

    
        const updatedUser=await userModel.findById(id)

        return res.status(200).json({
            user:updatedUser,
            message:"success"
        })}
        catch(err){
            console.log(err)
            return res.status(500).json({message:err.message})
        }
    }
}

module.exports=userController