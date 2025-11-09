const mongoose=require('mongoose')

const propertySchema=mongoose.Schema({
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
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
      overall:{type: Number,default:0},
      cleanliness: {type: Number,default:0},
      accuracy: {type: Number,default:0},
      communication:{type: Number,default:0},
      location: {type: Number,default:0},
      value: {type: Number,default:0}
    },
    reviews_count: Number,
    isActive:Boolean
},{timestamps:true})

const propertyModel=mongoose.model('properties',propertySchema)

module.exports=propertyModel