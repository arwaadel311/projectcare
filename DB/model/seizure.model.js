
import mongoose, { Schema, Types, model } from "mongoose";

const seizureSchema = new Schema({

  patientId: { type: Types.ObjectId, ref: 'Patient' },
  heartRate: { type: Number },
  motionRate: { type: Number },
  type: { type: String, enum: ['0', '1'], required: true, default: '1' },
  Time: { type: Date, required: true },
  //location
  lat: { type: Number },
  lng: { type: Number },

}
  , {
    timestamps: true
  });

const seizureModel = mongoose.models.Seizure || model('Seizure', seizureSchema)

export default seizureModel