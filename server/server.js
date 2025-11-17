const express=require('express');
const cookieParser=require('cookie-parser')
const mongoose=require('mongoose');
const MongoDB = require('./services/db');
require('dotenv').config();
const authRoutes=require('./routes/auth')
const userRoutes=require('./routes/user')
const propertyRoutes=require('./routes/property')
const bookingRoutes=require('./routes/booking')
const paymentRoutes=require('./routes/payment')
const cors=require('cors')


const app=express()


app.use(express.json())
app.use(cookieParser())
// app.use(express.urlencoded({extended:true}))
//add json limit 
// app.use(express.json({ limit: '50mb' }));

app.use(cors({
    origin:['https://airbnb-clone-phi-jade.vercel.app','http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST','PATCH', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
}));

MongoDB.connect(process.env.MONGODB_URI)



app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/properties',propertyRoutes)
app.use('/api/bookings',bookingRoutes)
app.use('/api/payments',paymentRoutes)


app.use('/api',async (req,res) => {
    res.send("Welcome to AirBnB Server 🤠")
})
port=5000
app.listen(port,()=>{
    console.log(`Server started at  http://localhost:${port}`)
})