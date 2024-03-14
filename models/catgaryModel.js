import mongoose from "mongoose";
const catgeoryShema = new mongoose.Schema({
    name:{
        type: String,
        requried:true,
        unique:true
    },
    slug:{
        type:String,
        lowercase:true,
    },
});
export default mongoose .model('category',catgeoryShema);