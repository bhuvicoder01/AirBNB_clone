const userModel = require("../models/User")

class userController{
    static updateProfile=async (req,res) => {

        const {_id, firstName,lastName,email,avatar}=req.body
        await userModel.updateOne({_id:_id},
            {$set:{firstName:firstName,lastName:lastName,email:email,avatar:{url:avatar}}}, 
            { upsert: false })

        const updatedUser=await userModel.findById(_id)

        return res.status(200).json({
            user:updatedUser,
            message:"success"
        })
    }
}

module.exports=userController