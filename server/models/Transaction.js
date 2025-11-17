const mongoose=require('mongoose')

const TransactionSchema=mongoose.Schema({
    transactionId:{type:String,required:true,unique:true},
    bookingId:{type:String,required:true},
    amount:Number,
    type:String,
    currency:String,
    status:{
        type:String,
        enum:['pending','paid','failed'],
        default:'pending'
    },
    paymentInfo:{
        method:{type:String,enum:['credit_card','debit_card','paypal','cash','bank_transfer']
            ,default:'credit_card'
        }, 
        customerName:String,
        cardNumber:String,
        expiryDate:String,
        cvv:String
    },
    note:String,
    payee:{
        name:String,
        email:String,
        phone:String,
        address:String
    }
},{timestamps:true})
const transactionModel=mongoose.model('transactions',TransactionSchema)
module.exports=transactionModel