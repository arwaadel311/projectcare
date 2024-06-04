
import { Schema, model, Types } from 'mongoose'

const complaintSchema = new Schema({

  email: { type: String, required: true, },
    complaint: { type: String, required: true }, 
    replyComplaint: { type: String,default:null },
    role: { type: String },
    firstName: { type: String},
    lastName: { type: String},
    phone_one: { type: String}

}, {
    timestamps: true
})

const complaintModel = model('Complaint', complaintSchema)
export default complaintModel