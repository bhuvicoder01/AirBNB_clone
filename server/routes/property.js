const express=require('express')
const propertyController = require('../controllers/propertyController')

const router=express.Router()

router.get('/',propertyController.getAll)
router.get('/:id',propertyController.getById)
router.post('/create',propertyController.create)

module.exports=router