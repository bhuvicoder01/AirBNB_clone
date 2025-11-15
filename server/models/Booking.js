const mongoose=require('mongoose')

const bookingSchema=mongoose.Schema({
        propertyId:{type:String,required:true},
        hostId:{type:String,required:true},
        propertyTitle: String,
        checkIn:Date,
        checkOut:Date,
        guests:Number,
        totalPrice: Number,
        status:{type:String,
            enum:['confirmed','pending','cancelled','completed'],
            default:'confirmed'
        },
        userId: {type:String,required:true}
},{timestamps:true})

const bookingModel=mongoose.model('bookings',bookingSchema);

module.exports=bookingModel;