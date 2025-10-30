const mongoose=require('mongoose')

const propertySchema=mongoose.Schema({
    title: String,
    description:String,
    location: {
      city:String,
      country: String,
      lat: String,
      lng: String
    },
    price_per_night: String,
    property_type: String,
    bedrooms: Number,
    beds: Number,
    bathrooms: Number,
    max_guests: Number,
    amenities: [String],
    images: [String],
    host: {
      name: String,
      avatar: String,
      superhost: Boolean,
      response_time: String
    },
    rating: {
      overall: Number,
      cleanliness: Number,
      accuracy: Number,
      communication: Number,
      location: Number,
      value: Number
    },
    reviews_count: Number
},{timestamps:true})

const propertyModel=mongoose.model('properties',propertySchema)

module.exports=propertyModel