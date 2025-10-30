const propertyModel = require("../models/Property")

class propertyController{
    static getAll=async (req,res) => {
        const properties=await propertyModel.find({})
        console.log(properties)
        return res.json(properties)
    }
    static getById=async (req,res) => {
        const id=req.params.id
        const property=await propertyModel.findById(id)

        return res.json(property)
    }

    static create=async (req,res) => {
        const body=req.body

        const properties=await propertyModel.create(body)

        return res.json({
            proprties:properties,
            message:"success"
        })
    }
}

module.exports=propertyController