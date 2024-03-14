import catgaryModel from "../models/catgaryModel.js"

import slugify from "slugify"
export const categoryController = async (req,res)=>{
    try {
        const { name } = req.body;
        if(!name){
            return res.status(401).send({message:"name is Required...?"})
        }
        const existingCategory = await catgaryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success: true,
                message:"Catgory Already Exisits"

            })
        }
        const category = await new catgaryModel({name,slug:slugify(name)}).save()
        res.status(201).send({
            success: true,
            message:"New Categary Created",
            category,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"error in Category"
        })
    }
}


// update category 
export const updateCategoryController = async (req, res) => {
    try {
      const { name } = req.body;
      const { id } = req.params;
      const category = await catgaryModel.findByIdAndUpdate(
        id,
        { name, slug: slugify(name) },
        { new: true }
      );
      res.status(200).send({
        success: true,
        messsage: "Category Updated Successfully",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while updating category",
      });
    }
  };

  //All catgory
  // get all cat
export const categoryControlller = async (req, res) => {
    try {
      const category = await catgaryModel.find({});
      res.status(200).send({
        success: true,
        message: "All Categories List",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting all categories",
      });
    }
  };
  
// Single Category
 // single category
export const singleCategoryController = async (req, res) => {
    try {
      const category = await catgaryModel.findOne({ slug: req.params.slug });
      res.status(200).send({
        success: true,
        message: "Get SIngle Category SUccessfully",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error While getting Single Category",
      });
    }
  };
  

  //delete Single Product
  export const deleteCategoryController = async (req,res)=>{

    try {
        const { id } = req.params;
        await catgaryModel.findByIdAndDelete(id)
        res.status(201).send({
            success:true,
            message:"Category is Delete ...",
   
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Deleating Error Plase Try Again...",
            error,
        })
    }
  }
 