import  express  from "express";
import {isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import {categoryController, categoryControlller,
     singleCategoryController, updateCategoryController,deleteCategoryController
    } from "./../controllers/categoryController.js"
const router = express.Router()

//Catgary router
router.post('/crate-category',requireSignIn,isAdmin,categoryController)
//update catgary
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)
// get All Category
router.get('/get-category',categoryControlller)
// get Single Category
router.get('/single-category/:slug',singleCategoryController)
// deletade product category wise
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController)

export default router