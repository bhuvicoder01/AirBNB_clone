const bookingModel = require("../models/Booking");
const propertyModel = require("../models/Property");

class bookingController {
    static getAll = async (req, res) => {
        try {

            const bookings = await bookingModel.find({});

            return res.json(bookings)
        }
        catch (error) {
            console.error(error)
            res.status(500).json({ message: `server error:${error}` })
        }
    }
    static getUserBookings=async (req,res) => {
        const userId=req.params.id;
        const userBookings=await bookingModel.find({userId:userId}).sort('checkIn')
        // console.log(userBookings)
        return res.json({bookings:userBookings});

    }
    static getById=async (req,res) => {
     const id=req.params.id
     const booking=await bookingModel.findById(id)
     return res.json(booking)   
    }

    static create=async (req,res) => {
      try{  const body=req.body;
        console.log(`creating booking with:${body}`)

        

        const booking=await bookingModel.create(body);

        return res.json({booking:booking,message:"success"});
    }catch(error){
        res.json({message:`server error:${error}`})
    }
        
    }

    static cancel=async (req,res) => {
        const id=req.params.id
        const result=await bookingModel.findByIdAndUpdate(id,{status:'cancelled'})

        return res.json({
            message:result
        })
    }

    static getAllBookingsForHostProperties=async (req,res) => {
        const id=req.params.id
        console.log(id)

        const bookings=await bookingModel.find({hostId:id})
        
        console.log(bookings)

        res.json({bookings:bookings,message:'success'})
        
    }
}

module.exports = bookingController;