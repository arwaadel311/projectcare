import { asyncHandler } from "../../../utils/errorHandling.js";


import doctorModel from '../../../../DB/model/doctor.model.js'

import patientModel from '../../../../DB/model/patient.model.js'

import guardianModel from "../../../../DB/model/guardian.model.js";

import seizureModel from "../../../../DB/model/seizure.model.js";




export const seizures = asyncHandler(async (req, res, next) => {
    const seizure = await seizureModel.find()
    return res.status(200).json({ message: "Done", seizure })
})


//Receive rates from flutter

export const createSeizure = asyncHandler(async (req, res, next) => {
    const { patientId } = req.params
    const { heartRate, motionRate, Time, type, lat, lng } = req.body
    const patient = await patientModel.findById(patientId)
    if (!patient) {

        return res.status(200).json({ message: "in valid" })
    }

    if (type==0) {
        
        return res.status(200).json({ message: "not seizure" })
    }

    const patientSeizure = await seizureModel.create({
        heartRate, motionRate, Time, type, patientId: patientId, lat, lng
    })
   
    //patient.guardianIds.push([req.guardian._id])
    if (patientSeizure.type==1) {
       // return res.status(200).json({ message: "Done" })
    
    patient.seizureHistory.push(patientSeizure)
    await patient.save()
    return res.status(200).json({ message: "Done", patientSeizure })
    }
})







// export const sendLocation = async (req, res, next) => {

//     const patientLOcation = await seizureModel.findOne({ type })
//     if (type == "1") {

//         return res.status(200).json({ message: "seizure", })

//     }


//     if (type == "not seizure") {
//         return res.status(200).json({ message: "not seizure", })
//     }
// }
