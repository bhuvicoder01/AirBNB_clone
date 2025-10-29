const bcrypt=require('bcrypt');
const userModel = require('../models/User');

const auth=async(req ,res,next)=>{
    try{
        const id=req.params.id;

    const user=await userModel.findById(id);
    if(!user){
        return res.status(403).json({
            message:'No Authentication exists'
        })
    }
    req.user=user
    next()
}
    catch(error){
        res.status(500).json({
            message:`Server error:${error}`
        })
    }
}
module.exports=auth