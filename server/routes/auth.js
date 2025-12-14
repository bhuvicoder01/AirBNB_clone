const express=require('express')
const authController=require('../controllers/authController');
const auth = require('../middleware/auth');

const router=express.Router();

router.get('/:id',auth,authController.checkAuth)
router.post('/register',authController.signup)
router.post('/login',authController.login)

router.post('/google',authController.googleAuth)

module.exports=router