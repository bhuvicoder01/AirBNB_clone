const TransactionController = require('../controllers/transactionController');

const router=require('express').Router();

router.post('/booking/:id',TransactionController.createTransaction)

module.exports=router