const mongoose=require('mongoose')

const UserSchema= mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','staff','host','guest'],
        default:'guest',
        required:true
    },
    phone:{
        type:String
    },
    address:{
        type:String
    },
    avatar:{
        public_id:{
            type:String,
        },
        url:String
    }
},{timestamps:true}
)

const userModel=mongoose.model('user',UserSchema);

module.exports=userModel;