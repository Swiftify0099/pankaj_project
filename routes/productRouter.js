import  express  from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js"
import { 
    GetSimalerProduct,
    brainTreePaymentController,
   
    braintreeTokenController,
    createProductController,
     deleteProduct,
     getProductController,
     getProductPhoto, 
     getSingleProduct, 
     productCategoryController, 
     productCountController, 
     productFiltersController, 
     productListController, 
     searchProductController, 
     updateProductController 
    } from "../controllers/productController.js";
import formidable from "express-formidable"
const router =express.Router();
// Product routs
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)
//Update Product
router.put('/update-product/:id',requireSignIn,isAdmin,formidable(),updateProductController)
// Get All Product 
router.get('/get-product',getProductController)
// Get single product
router.get('/get-product/:slug',getSingleProduct)
// Photo 
router.get('/photo-product/:pid',getProductPhoto)
// Delete Single Product 
router.delete('/product/:id',deleteProduct)
//filter product
router.post("/product-filter",productFiltersController)
//Product Count
router.get("/product-count", productCountController)
//Product PrePage
router.get(`/product/list/:page`, productListController)
// Surch Product Route Get
router.get(`/product/surch/:keyword`,searchProductController)
//Simaler Product
router.get(`/similer-product/:pid/:cid`,GetSimalerProduct)
//Single category Base Product Find
router.get("/single-product-category/:slug",productCategoryController)

//payment getway
//token
router.get('/braintree/token',braintreeTokenController)
//payment
router.post('/braintree/payment',requireSignIn,brainTreePaymentController)

export default router