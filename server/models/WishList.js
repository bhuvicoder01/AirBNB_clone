const mongoose=require('mongoose')

const wishListSchema=mongoose.Schema({
    propertyId:String,
    userId:String,
},{timestamps:true})

const wishListModel=mongoose.model('wishLists',wishListSchema)

module.exports=wishListModel