import mongoose, { Schema, Types, model } from "mongoose";

const rateSchema = new Schema({
heartRate:{type:Number,default:null},
motionRate:{type:Number,default:null}

   // qrCode:{type:String,default:null}
}, {
    timestamps: true
  });
  
  const rateModel = mongoose.models.Rate || model('Rate', rateSchema)
  
  export default rateModel