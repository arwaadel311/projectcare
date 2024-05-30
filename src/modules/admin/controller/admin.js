
import adminModel from '../../../../DB/model/admin.model.js'
  import doctorModel from '../../../../DB/model/doctor.model.js'
import guardianModel from '../../../../DB/model/guardian.model.js'
import patientModel from '../../../../DB/model/patient.model.js'
import { generateToken } from '../../../utils/GenerateAndVerifyToken.js'
import { compare, hash } from '../../../utils/HashAndCompare.js'
import { asyncHandler } from '../../../utils/errorHandling.js'


export const admin = async (req, res, next) => {
    const admin = await adminModel.find()
    return res.status(200).json({ message: "Done", admin })
}

export const loginAdmin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    
    
    //check email exist
    const admin = await adminModel.findOne({ email })
    if (!admin) {
        return res.status(200).json({
            
          status:"false",
            message: "email not exist"
        })
    }
   
 
    const match = compare({ plaintext: password, hashValue: admin.password })
    if (!match){
        return res.status(200).json({
        
        status:"false",
        message: "In-valid password"
    
})
}


    const access_Token = generateToken({
        payload: { id: admin._id },
        expiresIn: 60 * 60 * 24 * 30 * 12 
    })
    const refresh_token = generateToken({
        payload: { id: admin._id },
        expiresIn: 60 * 60 * 24 * 365
    })
    const adminID_token = { id: admin._id }
    await admin.save()
    return res.status(200).json({
        status:"true",
        message: "Done admin login",
        access_Token,
        refresh_token,
        adminID_token
    })
})

//approveAdmin
export const approveAdmin = async (req, res, next) => {
    const { doctorId } = req.params
    const doctor = await doctorModel.findById(doctorId)
    if (!doctor) {
        return next(new Error('In-valid account', { cause: 200 }))

    }
    doctor.isApproved = true
    await doctor.save()
    return res.status(200).json({ message: "Done Approved" })
}
//get all doctor request
export const GetAllDoctorsApprovedFalse = async (req, res, next) => {

    const doctors = await doctorModel.find({ isApproved: false })

    return res.status(200).json({ message: "Done not Approved", doctors })
}

//get all users
export const GetAllDoctor = async (req, res, next) => {

    const doctors = await doctorModel.find({ isLogin: true })
    return res.status(200).json({ message: "Done", doctors })
}

export const GetAllPatient = async (req, res, next) => {
const patients = await patientModel.find({ isLogin: true })
    return res.status(200).json({ message: "Done", patients })
}


export const GetAllGuardian = async (req, res, next) => {
    const guardians = await guardianModel.find({ isLogin: true })
        return res.status(200).json({ message: "Done", guardians })
    }
    



//get all doctor request
export const deleteDoctor= async (req, res, next) => {

   
    const { doctorId } = req.params
    const doctor = await doctorModel.findByIdAndDelete(doctorId)
    if (!doctor) {
        return next(new Error('In-valid account', { cause: 200 }))

    }
    
    const patient = await patientModel.findOne({doctorId});
    patient.doctorId=null
    await patient.save()    
    return res.status(200).json({ message: "Done" })
}


export const deletePatient= async (req, res, next) => {

   
    const { patientId } = req.params
    const patient = await patientModel.findByIdAndDelete(patientId)
    if (!patient) {
        return next(new Error('In-valid account', { cause: 200 }))

    }
    
    const doctor = await doctorModel.findOne({patientId});
    doctor.patientId=null
    await doctor.save()
    
    const guardian = await guardianModel.findOne({patientId});
    guardian.patientId=null
    await guardian.save()
    
    return res.status(200).json({ message: "Done" })
}

export const deleteGuardian= async (req, res, next) => {

   
    const { guardianId } = req.params
    const guardian = await guardianModel.findByIdAndDelete(guardianId)
    if (!guardian) {
        return next(new Error('In-valid account', { cause: 200 }))

    }

    const patient = await patientModel.findOne({guardianId});
    patient.guardianId=null
    await patient.save()    
    
    return res.status(200).json({ message: "Done" })
}









// export const signUpAdmin = asyncHandler(async (req, res, next) => {
//     const { email,userName, password } = req.body
//     const checkAdmin = await adminModel.findOne({ email: email.toLowerCase() })
//     if (checkAdmin) {
//         return next(new Error(`Email exist`, { cause: 404 }))
//     }
//     const hashPassword = hash({ plaintext: password })
//     const { _id } = await adminModel.create({
//         userName  , email, password: hashPassword,
//     })
//     return res.status(200).json({ message: "Done admin signUp",_id})
// })