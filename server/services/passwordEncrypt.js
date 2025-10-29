const bcrypt=require('bcrypt')

const encrypt=async (rawPassword) => {
    try{
        const hashedPassword=await bcrypt.hash(rawPassword,12)
        return hashedPassword
    }
    catch(error)
    {
        return res.status(500).json({
            message:"error during hashing password"
        })
    }
}
module.exports=encrypt