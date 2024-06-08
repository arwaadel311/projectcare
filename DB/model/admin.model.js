
import mongoose, { Schema, model } from "mongoose";

const adminSchema = new Schema({
  firstName:  { type: String, required: [true,'firstName is required']
  ,min:[2,'minimum length 2 char'], max:[20,'minimum length 20 char']
  ,lower:true,trim:true},
  profileImage:String,
  
  lastName:  { type: String, required: [true,'lastName is required']
  ,min:[2,'minimum length 2 char'], max:[20,'minimum length 20 char']
  ,lower:true,trim:true},
  email: { type: String, required: true, unique: true ,lower:true,trim:true},
  password: { type: String},
 // certificateAdmin: { type: Object},
  role: { type: String, default: 'Admin' },
  status: { type: String,default: 'offline',enum: ['offline', 'online', 'block']},
  
  isLogin:{type:Boolean,default:false},
}
, {
  timestamps: true
});

const adminModel = mongoose.models.Admin || model('Admin', adminSchema)

export default adminModel