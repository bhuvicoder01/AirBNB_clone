const userModel =require('../models/User');
const encrypt = require("../services/passwordEncrypt");
const cloudinary=require('../services/cloudinary')
const bcrypt=require('bcrypt')

class authController{
    static checkAuth=async (req,res) => {
        try {
            const user=req.user
            return res.json({user:user})
            
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                message:`$server error:{error}`
            })
        }
        
    }
    static signup=async (req,res) => {
       try{ const body=req.body;
        console.log(body)
        if(!body){
            console.error("No body is found in the request:authcontroller")
            return res.status(500).json({
              message:"No data is found in the request"
            })
        }
        const password=req.body.password;
        console.log("before encrypt")
        const encryptedPassword=await encrypt(password)
        console.log("after encrypt")
        console.log(encryptedPassword)

        const {firstName,lastName,email,role}=req.body
        const user=await userModel.create({firstName,lastName,email,password:encryptedPassword,role})

        if(user){
            console.log(user)
            return res.json(user)
        }
        else{
            console.error("error on creating user")
            return res.status(500).json({
                message:"cant create mongodb doc"
            })
        }}
        catch(error){
            console.error(error)
            res.status(500).json({
                message:`server error`
            })
        }
    }

    static login=async (req,res) => {
        const {email,password}=req.body;

        if(req.user){
            console.log(req.user)
            return res.status(200).json({user:req.user,message:"Authentication already exists"})
        }
        const user=await userModel.findOne({email:email});
        if(!user){
            return res.status(400).json({
                message:"Account for this email doesn't exists"
            })
        }
        if(bcrypt.compare(password,user.password)){
            return res.json({
                user:user,
                message:'success'
            })
        }
        else{
            return res.status(400).json({
                message:"credentials doesn't match"
            })
        }
    }
}
module.exports=authController