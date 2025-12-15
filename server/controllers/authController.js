const userModel =require('../models/User');
const encrypt = require("../services/passwordEncrypt");
const cloudinary=require('../services/cloudinary')
const bcrypt=require('bcrypt')
const {OAuth2Client}=require('google-auth-library')

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI // match what you used in Google Cloud
);

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

    static googleAuth=async(req, res)=>{
        try{
            const {code}=req.body
            if(!code){
                return res.status(400).json({
                    message:"code is required"
                })
            }

            const {tokens}=await oAuth2Client.getToken({
                code,
                redirect_uri:`${process.env.NODE_ENV==='development'?`${process.env.GOOGLE_REDIRECT_URI_DEV}`:`${process.env.GOOGLE_REDIRECT_URI_PROD}`}`
            })

            const ticket=await oAuth2Client.verifyIdToken({
                idToken:tokens.id_token,
                audience:`${process.env.GOOGLE_CLIENT_ID}`
            })

            const payload=ticket.getPayload()
            const {name,email,picture,sub:googleId}=payload
            
           
            const userInDatabase=await userModel.findOne({email})
            if(userInDatabase){
                if(!userInDatabase.googleId){
                    // console.log('updating google id')
                    userInDatabase.googleId=googleId
                    await userInDatabase.save()
                }
                 const userData={
                    _id:userInDatabase._id,
                    firstName:userInDatabase.firstName,
                    lastName:userInDatabase.lastName,
                    email:userInDatabase.email,
                    avatar:{url:userInDatabase.avatar.url},
                    // googleId:userInDatabase?.googleId,
                    role:userInDatabase.role,
                    createdAt:userInDatabase.createdAt,
                    updatedAt:userInDatabase.updatedAt
                }
                res.json({
                user:userData,
                message:"success login using google-oauth",
                isNewUser:false,
                success:true
                
            })   
            }
            
            else{
                   const firstName=name.split(' ')[0]
                   const lastName=name.split(' ')[1]
                   const password=await encrypt(`${firstName}123`)
                const newUser=await userModel.create({
                    firstName:firstName,
                    lastName:lastName,
                    email:email,
                    password:password,
                    googleId:googleId,
                   'avatar.url':picture
                })
                const userData={
                    _id:newUser._id,
                    firstName:newUser.firstName,
                    lastName:newUser.lastName,
                    email:newUser.email,
                    avatar:{url:newUser.avatar.url},
                    // googleId:newUser.googleId,
                    role:newUser.role,
                    createdAt:newUser.createdAt,
                    updatedAt:newUser.updatedAt
                }
                res.json({
                    user:userData,
                    message:"success created new user",
                    isNewUser:true,
                    success:true
                })
            }

            
            // const user=await userModel.findOne({email:email})
            // if(user){
            //     return res.json({
            //         user:user,
            //         message:"success"
            //     })
            // }
            // else{
            //     const newUser=await userModel.create({
            //         firstName:name,
            //         email:email,
            //         googleId:googleId,
            //         imageUrl:imageUrl,
            //         role:"guest"
            //     })
            //     return res.json({
            //         user:newUser,
            //         message:"success"
            //     })
            // }
        }
        catch(error){
            console.error(error)
            res.status(500).json({
                message:`server error`,
                error:error
            })
        }
    }
}
module.exports=authController