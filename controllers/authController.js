import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { hash } from "bcrypt";
import orderModel from "../models/orderModel.js";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone,  address,answer } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ error: "Email is Required" });
    }
    if (!password) {
      return res.send({ error: "Password is Required" });
    }
    if (!phone) {
      return res.send({ error: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ error: "Address is Required" });
    }
    if (!answer) {
      return res.send({ error: "answer is Required" });
    }
    //check user
    const exisitingUser = await userModel.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: true,
        message: "Already Register please login",
      });
    }
   
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
      
    }).save();
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Errro in Registeration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
 
  try {
    const { email, password } = req.body;
    //validation
   
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
     
    }
    //token
    const token =  JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    
  
    res.status(200).send({
      
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user. address,
           role:user.role,
      },
     token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
 //forgat password
 export const forgotPasswordController = async(req,res) =>{
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Emai is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
 }

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

export const updateProfileController = async (req,res)=>{
  try {
    
    const { name, email, password, phone, address, } = req.body;
      const user = await userModel.findById(req.user._id)
    // password
    if(password && password.length < 6){
      return res.json({
        message:"Password is required and 6 charectr Long...." })
      }
      const hashedPassword = password? await hashPassword(password):undefined;
      const updateUser = await userModel.findByIdAndUpdate(req.user._id,{
        name : name || user.name,
        email :email || user.email,
        password: hashedPassword || user.password,
        phone:phone || user.phone,
        address:address || user.address,
      },{new:true});
  
    res.status(201).send({
      success:true,
      message:"User Profile Updated..",
      updateUser
    });
    }
    catch (error) {
    console.log(error)
    res.status(400).send({
      success:false,
      message:"User Profile Dose Not Update.",
      error,
    })
  }
}
//orders
//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      // .sort({createdAt:"-1"});
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
 export const OrdersStatusController = async (req,res)=>{
  try {
    const {orderId}= req.params;
    const {status}=req.body
    const orders = await orderModel
      .findByIdAndUpdate(orderId,{status},{new:true})
     
    res.json(orders);
  }
  catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
 }
  //Get all User Data 
  // export const userdata = async (req,res )=>{
  //   try {
  //     const user = await user({ name, email, password, phone,  address,answer,})
  //     res.send.json({ userdata})
  //   } catch (error) {
  //     console.log(error)
  //     res.send({
  //       message:"Cude nat get get data from user data",
  //       success:false,
  //       error
  //     })
  //   }

  // }