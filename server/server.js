const express=require('express');
const cookieParser=require('cookie-parser')
const mongoose=require('mongoose');
const MongoDB = require('./services/db');
require('dotenv').config();
const authRoutes=require('./routes/auth')
const userRoutes=require('./routes/user')
const propertyRoutes=require('./routes/property')
const cors=require('cors')


const app=express()


app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin:'*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
}));

MongoDB.connect(process.env.MONGODB_URI)



app.use('/api/auth',authRoutes)
app.use('/api/users',userRoutes)
app.use('/api/properties',propertyRoutes)


app.use('/api',async (req,res) => {
    res.send("Welcome to AirBnB Server 🤠")
})
port=5000
app.listen(port,()=>{
    console.log(`Server started at  http://localhost:${port}`)
})