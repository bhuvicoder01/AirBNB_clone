const propertyModel = require("../models/Property")
const userModel = require("../models/User")
const cloudinary = require("../services/cloudinary")

class userController{

    static getAllUsers=async (req, res) => {
        try{
            const users=await userModel.find()
            return res.status(200).json({users})
        }
        catch(err){
            return res.status(500).json({message:err.message})
        }
    }
    static deleteUser=async (req, res) => {
        try{
            const id=req.params.id
            const user=await userModel.findById(id)
            if(!user){
                return res.status(404).json({message:"User not found"})
            }
            await userModel.deleteOne({_id:id})
            return res.status(200).json({message:"success"})
        }
        catch(err){
            return res.status(500).json({message:err.message})
        }
    }



    static getUser=async (req, res) => {
        try{
            const id=req.params.id
            const user=await userModel.findById(id)
            return res.status(200).json({user})
        }
        catch(err){
            return res.status(500).json({message:err.message})
        }
    }

    static updateProfile=async (req,res) => {
try{
    if(!req.body){
        return res.status(400).json({message:"No request is found"})
    }
        const { firstName,lastName,email}=req.body
        // console.log(req.file)
        const id=req.params.id
        const {role}=req?.body
        console.log(role)
        const avatar=req.file
        // console.log(avatar)
        if(avatar){
            //  const result=await cloudinary.uploader.upload(avatar.path,{folder:'avatars'})
        await userModel.updateOne({_id:id},
            {$set:{firstName,lastName,email,role,avatar:{public_id:avatar.bucket,url:avatar.location}}}, 
            { upsert: false })
        await propertyModel.updateMany({hostId:id},{'host.avatar':avatar.location}
            ,{ upsert: false }
        )   
        }
        await userModel.updateOne({_id:id},
            {$set:{firstName,lastName,email,role}}, 
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

    static applyHost=async (req, res) => {
        try{
            const id=req.params.id
            const user=await userModel.findById(id)
            if(user.role==='host'){
                return res.status(400).json({message:"User is already a host"})
            }
            await userModel.updateOne({_id:id},{$set:{role:'host'}})
            return res.status(200).json({message:"success"})
        }
        catch(err){
            return res.status(500).json({message:err.message})
        }
    }
}

module.exports=userController