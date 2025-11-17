const bookingModel = require("../models/Booking");
const transactionModel = require("../models/Transaction");

class TransactionController{
    static async createTransaction(req,res){
        try {
            const {amount,currency,cardName,cardLast4,cardNumber,email,address,expiryDate,cvv}=req.body;
            const{id}=req.params;
            const bookingId=id;

            if(bookingId){
                const booking=await bookingModel.findById(bookingId);
                if(!booking){
                    return res.status(404).json({message:"Booking not found"})
                }
                if(booking.status==='confirmed' || booking.payment.status==='paid'){
                    const transaction=await transactionModel.findOne({bookingId:bookingId});
                    return res.status(200).json({message:"Booking already confirmed and paid",transaction,success:'false'})
                }
            }
            let body={
                transactionId:`TXN-${new Date().getFullYear()}${new Date().getMonth()+1}${new Date().getDate()}-${new Date().getTime()}`,
                amount,
                currency,
                payee:{
                    name:cardName,
                    email,
                    address,
            },
                bookingId,
                status:'paid',
                paymentInfo:{method:"credit_card",customerName:cardName,cardNumber,expiryDate,cvv}}
            const transaction=new transactionModel(body)
           
           if(transaction)
            { await bookingModel.findByIdAndUpdate(bookingId,{status:'confirmed',payment:{status:'paid',amount,currency,transactionId:transaction.transactionId}})
            await transaction.save();
        }
            
            res.status(201).json({transaction,message:"Transaction created successfully",success:true})
        } catch (error) {
            console.log(error)
            res.status(500).json({message:"Internal server error"})
        }
    }

    static async getTransactions(req,res){
        try {
            const {userId}=req.params;
            const transactions=await transactionModel.find({author:userId});
            res.status(200).json({message:"Transactions fetched successfully",transactions})
        } catch (error) {
            console.log(error)
            res.status(500).json({message:"Internal server error"})
        }
    }
}
module.exports=TransactionController;