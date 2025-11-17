const mongoose=require('mongoose')

const bookingSchema=mongoose.Schema({
        propertyId:{type:String,required:true},
        hostId:{type:String,required:true},
        propertyTitle: String,
        checkIn:Date,
        checkOut:Date,
        guests:Number,
        totalPrice: Number,
        pricePerNight:Number,
        payment:{
            status:{type:String,
                enum:['pending','paid','failed'],
                default:'pending'
            }
            ,amount:Number
            ,currency:String,
            transactionId:String,
            date:String
        },
        status:{type:String,
            enum:['confirmed','pending','cancelled','completed','expired'],
            default:'pending'
        },
        userId: {type:String,required:true},
        isCheckedIn:{type:Boolean,default:false},
        isCheckedOut:{type:Boolean,default:false}

},{timestamps:true})

const bookingModel=mongoose.model('bookings',bookingSchema);

module.exports=bookingModel;