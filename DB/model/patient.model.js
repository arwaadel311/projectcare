import mongoose, { Schema, Types, model } from "mongoose";

const patientSchema = new Schema({
  firstName: {
    type: String, required: [true, 'firstName is required']
    , min: [2, 'minimum length 2 char'], max: [20, 'minimum length 20 char']
    , lower: true, trim: true
  },

  lastName: {
    type: String, required: [true, 'lastName is required']
    , min: [2, 'minimum length 2 char'], max: [20, 'minimum length 20 char']
    , lower: true, trim: true
  },

  email: { type: String, required: true, unique: true, lower: true, trim: true },
  confirmEmail: { type: Boolean, default: false },
  emailCode: { type: Number, default: null },
  verifyEmail: { type: Boolean, default: false },
  EmailPasswordCode: { type: Number, default: null },
  phone_one: { type: String, required: true, },
  phone_two: { type: String, required: true, },
  heartRate: { type: Number, default: null },
  motionRate: { type: Number, default: null },
  currentMotionRate: { type: Number, default: null },
  //location
  lat: { type: String,default: null },
  lng: { type: String ,default: null},

  password: { type: String, required: true, },
  gender: { type: String, enum: ['Male', 'Female'], required: true, default: 'Male' },
  homeAddress: { type: String, required: true },
  birthDate: { type: Date, required: true },
  status: { type: String, default: 'offline', enum: ['offline', 'online', 'block'] },
  role: { type: String, default: 'Patient' },
  isLogin: { type: Boolean, default: false },
  doctorId: { type: Types.ObjectId, ref: 'Doctor', default: null },

  seizureHistory: [{ type: Types.ObjectId, ref: 'Seizure' }],
  guardianIds: [{ type: Types.ObjectId, ref: 'Guardian', default: null }]
  ,
  // qrCode:{type:String,default:null}
}, {
  timestamps: true
});

const patientModel = mongoose.models.Patient || model('Patient', patientSchema)

export default patientModel