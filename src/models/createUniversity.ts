import { time } from "console";
import mongoose, { models } from "mongoose";

const universitySchema = new mongoose.Schema({
name:{type:String,required:true,unique:true},
logo:{type:String,required:true,default:""},
coverImage:{type:String,required:true,default:""},
location:{type:String,required:true,default:""},
bio:{type:String,required:true,default:""},
 website: {
      type: String,
      trim: true,
      default: "",
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        "Please enter a valid URL",
      ],
    },
estd:{type:Number,required:true,default:""},
varsityEmail:{ type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],},

type:{type:String,required:true,default:""},
regNumber:{type:String,required:true,default:""},
block:{type:Boolean,default:false},
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date, default: Date.now },
   
  
});

const University = mongoose.models.University || mongoose.model("University", universitySchema);
export default University;