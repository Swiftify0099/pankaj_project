import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  OrdersStatusController,
 
} from "../controllers/authController.js";
import {isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";


//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login",loginController);

//test routes
router.get("/test", requireSignIn,isAdmin,testController);

//protecated user rout
router.get('/user-auth', requireSignIn,(req,res)=>{
  res.status(200).send({ok:true});
})
 //forgate password
 router.post('/forgot-password', forgotPasswordController)
//Admin Route procated
router.get('/admin-auth',  requireSignIn, isAdmin,(req,res)=>{
  res.status(200).send({ok:true});
})
// user Profile
router.put('/profile', requireSignIn,updateProfileController)
// user Order
router.get('/orders', requireSignIn,getOrdersController)
// Admin Order
router.get('/get-all-orders', requireSignIn,isAdmin,getAllOrdersController)
// Admin Order Status Change
router.put('/orders-status/:orderId', requireSignIn,isAdmin,OrdersStatusController)
// get all data form databases
// router.get("/userdata",requireSignIn,isAdmin,userdata)
export default router;
