
import adminModel from '../../../../DB/model/admin.model.js'
  import doctorModel from '../../../../DB/model/doctor.model.js'
import guardianModel from '../../../../DB/model/guardian.model.js'
import patientModel from '../../../../DB/model/patient.model.js'
import { generateToken } from '../../../utils/GenerateAndVerifyToken.js'
import { compare, hash } from '../../../utils/HashAndCompare.js'
import { asyncHandler } from '../../../utils/errorHandling.js'

import cloudinary from '../../../utils/cloudinary.js'


export const admin = async (req, res, next) => {
    const admin = await adminModel.find()
    return res.status(200).json({ message: "Done", admin })
}

//add image profile
export const adminProfile = async (req, res, next) => {
    if (!req.files) {
        return res.status(200).json({ message: "file is required" })
    }
    
    const {secure_url}= await cloudinary.uploader.upload(req.files?.profileImage[0].path,
        
        { folder: `${process.env.APP_NAME}/admin/profileImage` })

    const admin = await adminModel.findByIdAndUpdate(req.admin._id,
        {profileImage:secure_url},{new:true})
    return res.status(200).json({ message: "Done", admin })
}

//logout
export const logoutAdmin= asyncHandler(async (req, res, next) => {

    const admin = await adminModel.updateOne({ _id: req.admin._id }, { status: 'offline', isLogin: 'false' })

    return res.status(200).json({ message: "Done is logout" })
})

//login admin
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
    if (!match) { return res.status(200).json({
            
        status:"false",
          message: "In-valid password"
      })
    }
    const access_Token = generateToken({
        payload: { id: admin._id },
        expiresIn: 60 * 30 * 24
    })
    const refresh_token = generateToken({
        payload: { id: admin._id },
        expiresIn: 60 * 60 * 24 * 365
    })
    const adminID_token = { id: admin._id }
    admin.isLogin = true
    admin.status = 'online'
    await admin.save()
    return res.status(200).json({
        status:"true",
        message: "Done admin login",
        data:req.body,
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
    


//delete users

export const deleteDoctor= async (req, res, next) => {

   
    const { doctorId } = req.params
   // const doctor = await doctorModel.findByIdAndDelete(doctorId)
     
   const patient = await patientModel.updateMany({doctorId:null});
   //console.log(patient);


   const doctor = await doctorModel.findByIdAndDelete(doctorId)
    if (!doctor) {
        return next(new Error('In-valid account', { cause: 200 }))

    }
    
   
 return res.status(200).json({ message: "Done" })
}


export const deletePatient= async (req, res, next) => {

   
    const { patientId } = req.params

const doctors = await doctorModel.find({patientId:patientId});

if (doctors.length > 0) {
    doctors.forEach((doctor) => {
        doctor.patientId.pull(patientId);
        doctor.save();
    });
  }
   //console.log(doctors);

    
    const guardians = await guardianModel.find({patientId:patientId});
    
if (guardians.length > 0) {
    guardians.forEach((guardian) => {
        guardian.patientId.pull(patientId);
        guardian.save();
    });
  }
  // console.log(guardians);


    const patient = await patientModel.findByIdAndDelete(patientId)
    if (!patient) {
        return next(new Error('In-valid account', { cause: 200 }))

    }
    
    
    
    return res.status(200).json({ message: "Done" })
}

export const deleteGuardian= async (req, res, next) => {

  
    const { guardianId } = req.params
   // const doctor = await doctorModel.findByIdAndDelete(doctorId)
     
   const patients = await patientModel.find({guardianIds:guardianId})
   if (patients.length > 0) {
    patients.forEach((patient) => {
      patient.guardianIds.pull(guardianId);
      patient.save();
    });
  }
  // console.log(patients);


   const guardian = await guardianModel.findByIdAndDelete(guardianId)
    if (!guardian) {
        return next(new Error('In-valid account', { cause: 200 }))

    }
    
    return res.status(200).json({ message: "Done" })
}





//profile
export const profile = asyncHandler(async (req, res, next) => {

    const admin = await adminModel.findById(req.admin._id)
    return res.status(200).json({ message: "profile",admin })

})





export const signUpAdmin = asyncHandler(async (req, res, next) => {
    const { email, firstName,lastName, password } = req.body
    const checkAdmin = await adminModel.findOne({ email })
    if (checkAdmin) {
        return next(new Error(`Email exist`, { cause: 200 }))
    }
    const hashPassword = hash({ plaintext: password })

    const { _id } = await adminModel.create({
        firstName,lastName, email, password: hashPassword,
    })


    return res.status(201).json({ message: "Done admin signUp", _id })
})