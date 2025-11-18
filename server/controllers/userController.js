const userModel = require("../models/User")

class userController{
    static updateProfile=async (req,res) => {
try{
        const {_id, firstName,lastName,email,avatar}=req.body
        await userModel.updateOne({_id:_id},
            {$set:{firstName:firstName,lastName:lastName,email:email,avatar:{url:avatar}}}, 
            { upsert: false })

        const updatedUser=await userModel.findById(_id)

        return res.status(200).json({
            user:updatedUser,
            message:"success"
        })}
        catch(err){
            console.log(err.message)
            return res.status(500).json({message:err.message})
        }
    }
}

module.exports=userController