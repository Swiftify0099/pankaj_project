import slugify from "slugify";
import productModel from "../models/productModel.js"
import catgaryModel from "../models/catgaryModel.js";
import fs from "fs"
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";

//payment Gatway
dotenv.config();
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANR_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

 export const createProductController = async (req,res)=>{
    try {

        const { name ,description,price, category, quantity} =  req.fields;
        const { photo }= req.files;
        // All Validation
        switch(true){
            case !name:
                return res.status(500).send({success:false,message:"Name Is Required"});
                   case !description:
                    return res.status(500).send({success:false,message:"description Is Required"});
                    case !price:
                        return res.status(500).send({ error: "Price is Required" });
                        case !category:
                            return res.status(500).send({success:false,message:"category Is Required"});
                            case !quantity:
                                return res.status(500).send({success:false,message:"quantity Is Required"});
                                case !photo && photo.size >1000000:
                                    return res.status(500).send({success:false,message:" Photo Shoud be The 1 Mb Is Required"});
        }
        const product = new productModel({...req.fields,slug:slugify(name)})
        if(photo){
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contantType = photo.type
        }
        await product.save()
        res.status(201).send({
            success:true,
            message:"Product Created SuccessFully...",
            product,
        })

    } catch (error) {
      console.log(error)
      res.status(500).send({
        success:false,
        message:"Product is Not Crated.....",
        error,
      })  
    }

 }
 export const getProductController = async (req,res)=>{
    try {
        const products = await productModel.find({})
        .select("-photo")
        .populate('category')
        .limit(10)
        .sort({createdAt:-1})
        res.status(200).send({
            success:true,
            message:" All Product",
            total: products.length,
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Can't Get Product",
            error,
        })
    }
 }
 export const getSingleProduct = async(req,res)=>{
    try {
     const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate('category')
         res.status(201).send({
            success:true,
            message:"Single Product Find SuccessFully....",
            product,
         })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Single Product Not Found ?",
            error,
        })
    }
 }
 export const getProductPhoto= async (req,res) =>{
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type',product.photo.contantType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Photo Con't Find .... ?",
            error,
        })
    }
 }
 export const deleteProduct = async (req,res)=>{
    try {
        const product = await productModel.findByIdAndDelete(req.params.id).select("-photo")
        res.status(201).send({
            success:true,
            message:"Product Delete SuccessFully...",
            product,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Coud Not Delet Product ...? ",
            error,
        })
    }
 }
 //update product 
 export const updateProductController = async (req,res)=>{
    try {

        const { name ,description,price, category, quantity} =  req.fields;
        const { photo }= req.files;
        // All Validation
        switch(true){
            case !name:
                return res.status(500).send({success:false,message:"Name Is Required"});
                
                     case !description:
                    return res.status(500).send({success:false,message:"description Is Required"});
                    case !price:
                        return res.status(500).send({ error: "Price is Required" });
                        case !category:
                            return res.status(500).send({success:false,message:"category Is Required"});
                            case !quantity:
                                return res.status(500).send({success:false,message:"quantity Is Required"});
                                // case !photo && photo.size < 1000000:
                                //     return res.status(500).send({success:false,message:" Photo Shoud be The 1 Mb Is Required"});
        }
        const product = await productModel.findByIdAndUpdate(req.params.id,
            {...req.fields, slug:slugify(name)},{new:true}
            )
        if(photo){
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contantType = photo.type
        }
        await  product.save()
        res.status(201).send({
            success:true,
            message:"Product Update SuccessFully...",
            product,
        })

    } catch (error) {
      console.log(error)
      res.status(500).send({
        success:false,
        message:"Product is Not Update.....?",
        error,
      })  
    }


 }
 //filters 
 export const productFiltersController = async (req, res) => {
    try {
      const { checked, radio } = req.body;
      let args = {};
      if (checked.length > 0) args.category = checked;
      if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
      const product = await productModel.find(args);
      res.status(200).send({
        success: true,
        product,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Filtering Products",
        error,
      });
    }
  };
  
 // Page Count
  export const productCountController = async (req, res) => {
    try {
      const total = await  productModel.find({}).estimatedDocumentCount();
      res.status(200).send({
        success: true,
        total,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Error in product count",
        error,
        success: false,
      });
    }
  };
 // product list base on page
export const productListController = async (req, res) => {
    try {
      const perPage = 6;
      const page = req.params.page ? req.params.page : 1;
      const products = await productModel
        .find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "error in per page ctrl",
        error,
      });
    }
  };
 // search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};
// get Simaler product
  export const GetSimalerProduct = async (req,res)=>{
    try {
      const { pid,cid } = req.params
      const product = await productModel.find({category:cid,_id:{$ne:pid},})
      .select("-phopo")
      .limit(3)
      .populate("category")
      res.status(201).send({
        success:true,
        message:" Simaler Product Found",
        product,
      })
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success:false,
        message:"Simaler Product not Found Yat...",
        error,
      })
    }
  }
  export const productCategoryController = async (req,res )=>{
    try {
      const category = await catgaryModel.findOne({slug:req.params.slug})
      const product = await productModel.find({category}).populate("category")
      res.status(201).send({
        success:true,
        message:"Find A Single Category.",
          category,
          product,
      })
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success:false,
        message:" CanNot Find Single Product Category ",
        error,
      })
    }
  }
  
//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

 //payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
