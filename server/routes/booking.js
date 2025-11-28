const express=require('express');
const bookingController = require('../controllers/bookingController');
const router=express.Router();

router.get('/user/:id',bookingController.getUserBookings)
router.post('/',bookingController.create)
router.get('/:id',bookingController.getById)
router.put('/:id/cancel',bookingController.cancel)
router.put('/:id/confirm',bookingController.confirm)

//host routes
router.get('/host/:id',bookingController.getAllBookingsForHostProperties)

module.exports=router