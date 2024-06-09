
import { hash, compare } from '../../../utils/HashAndCompare.js'
import { generateToken, verifyToken } from '../../../utils/GenerateAndVerifyToken.js'
import sendEmail from '../../../utils/email.js'
import { asyncHandler } from '../../../utils/errorHandling.js'
import guardianModel from '../../../../DB/model/guardian.model.js'

import doctorModel from '../../../../DB/model/doctor.model.js'
import adminModel from '../../../../DB/model/admin.model.js'

import patientModel from '../../../../DB/model/patient.model.js'
//all guardian
export const guardians = asyncHandler(async (req, res, next) => {
    const guardian = await guardianModel.find().select('-password -confirmEmail -emailCode -verifyEmail -EmailPasswordCode -isLogin')
    .populate({ path: 'patientId', select: ' firstName lastName email  phone_one' })
    return res.status(200).json({ message: "Done", guardian })
})
//signUp guardian
export const signupGuardian = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, gender, homeAddress,phone_one, phone_two, birthDate } = req.body
    
    const checkGuardian = await guardianModel.findOne({ email: email.toLowerCase() })
    const checkPatient = await patientModel.findOne({ email: email.toLowerCase() })
    const checkDoctor = await doctorModel.findOne({ email: email.toLowerCase() })
    const checkAdmin = await adminModel.findOne({ email: email.toLowerCase() })
    if (checkGuardian) {
        return next(new Error(`Email exist`, { cause: 200 }))
    }
    if (checkGuardian !== checkDoctor) {
        return next(new Error(`duplicated Doctor email`, { cause: 200}))
    }

    if (checkGuardian !== checkAdmin) {
        return next(new Error(`duplicated Admin email`, { cause: 200 }))
    }
    
    if (checkGuardian !== checkPatient) {
        return next(new Error(`duplicated patient email`, { cause: 409 }))
    }
    const emailCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{
        background-color: #88BDBF;margin: 0px;
    }
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
    care bracelet  
    </h1>
    </td>
    <td>
    
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellSpacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">verify email</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${emailCode}</p>
    </td>
    </tr>
    
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">confirm email</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`

    if (!await sendEmail({ to: email, subject: 'confirmation-email', html })) {
        return next(new Error(`fail to send this email`, { cause: 400 }))
    }
    ///hash password
    const hashPassword = hash({ plaintext: password })
    //save//create patient 

    const { _id } = await guardianModel.create({
        firstName, lastName, email,
        emailCode,
        password: hashPassword
        , gender, homeAddress,
        phone_one, phone_two, birthDate,
    })
    return res.status(201).json({ message: "Done", _id })
})
//confirm Email
export const confirmEmailGuardian = asyncHandler(async (req, res, next) => {
    const {  emailCode } = req.body
    const guardian = await guardianModel.findOne({ emailCode })
    if (!guardian) {
        return next(new Error('In-valid account', { cause: 200 }))
    }
    if (guardian.emailCode !== parseInt(emailCode)) {
        return next(new Error('In-valid reset code', { cause: 200 }))
    }
    guardian.emailCode = null;
    guardian.confirmEmail = true
    await guardian.save()
    return res.status(200).json({ message: "Done" })
})

//login
export const loginGuardian = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    //check email exist
    const guardian = await guardianModel.findOne({ email: email.toLowerCase() })
   
    if (!guardian) {
        return next(new Error(`email not exist`, { cause: 404 }))
    }
    if (!guardian.confirmEmail) {
        return next(new Error(`please confirm your Email first.`, { cause: 400 }))
    }
    const match = compare({ plaintext: password, hashValue: guardian.password })
    if (!match) {
        return next(new Error(`IN-valid login data`, { cause: 200 }))
    }
    const access_Token = generateToken({
        payload: { id: guardian._id },

        //expiresIn: 60 * 30 //1h
        expiresIn: 60 * 60 * 24 * 30 * 12 //1 month
    })


    const refresh_token = generateToken({
        payload: { id: guardian._id },

        expiresIn: 60 * 60 * 24 * 365
    })


    const guardianID_token = { id: guardian._id }
    
    guardian.isLogin = true
    guardian.status = 'online'
    await guardian.save()
    return res.status(200).json({
        message: "Done",
        access_Token,

        refresh_token,
        
        guardianID_token
    })
})
//logout
export const logoutGuardian = asyncHandler(async (req, res, next) => {
   
    const guardian = await guardianModel.updateOne({_id:req.guardian._id },{status:'offline',isLogin:'false'})
    
    return res.status(200).json({ message: "Done is logout"})
})
//profile
export const profileGuardian = asyncHandler(async (req, res, next) => {
    const guardian = await guardianModel.findById(req.guardian._id)
    return res.json({
        message: "Done",
        guardian
    })
})
//send code email Again
export const sendCodeEmail = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const emailCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    const guardian = await guardianModel.findOneAndUpdate({  email: email.toLowerCase() }, { emailCode })
    if (!guardian) {
        return next(new Error('In-valid account', { cause: 200 }))

    }
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{
        background-color: #88BDBF;margin: 0px;
    }
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
    care bracelet  
    </h1>
    </td>
    <td>
    
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellSpacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">verify email</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${emailCode}</p>
    </td>
    </tr>
    
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">confirm email</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`


    if (!await sendEmail({ to: email, subject: 'verify email', html })) {

        return next(new Error("fail to send this email", { cause: 400 }))

    }
    return res.status(200).json({ message: "Done" })
})
//sendCode
export const sendCodeGuardian = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const guardian = await guardianModel.findOne({  email: email.toLowerCase() })
    if (!guardian) {
        return next(new Error('In-valid account', { cause: 400 }))
    }
    const EmailPasswordCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{
        background-color: #88BDBF;margin: 0px;
    }
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
    care bracelet  
    </h1>
    </td>
    <td>
    
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellSpacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">check your email</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">${EmailPasswordCode}</p>
    </td>
    </tr>
    
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">verify code</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`

    if (!await sendEmail({ to: email, subject: 'con-email', html })) {
        return next(new Error(`fail to send this email`, { cause: 400 }))
    }
    guardian.EmailPasswordCode = EmailPasswordCode;

    await guardian.save()

    return res.status(200).json({ message: "Done" })
})
//check your email verifyCode forgetPassword
export const CodeForgetPasswordGuardian = asyncHandler(async (req, res, next) => {
    const {  EmailPasswordCode } = req.body

    const guardian = await guardianModel.findOne({ EmailPasswordCode })
    if (!guardian) {
        return next(new Error('In-valid account', { cause: 400 }))
    }
    if (guardian.EmailPasswordCode !== parseInt(EmailPasswordCode)) {
        return next(new Error('In-valid reset code', { cause: 400 }))
    }
    guardian.EmailPasswordCode = null;
    guardian.verifyEmail = true
    await guardian.save()
    return res.status(200).json({ message: "Done" })
})
// forgetPassword set a new password
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { newPassword } = req.body;
    console.log({ newPassword });
    
    const guardian = await guardianModel.findOne({ verifyEmail:true })
    if (!guardian) {
        return next(new Error('In-valid account', { cause: 400 }))
    }
    if (guardian.verifyEmail != true) {
        return next(new Error('In valid verify email'))
    }
    const hashPassword = hash({ plaintext: newPassword });
    guardian.password = hashPassword;
    guardian.verifyEmail = false
    await guardian.save();
    return res.status(200).json({ message: "Done reset", newPassword });
})
//Get guardian by Id
export const guardianById = asyncHandler(async (req, res, next) => {

    const guardian = await guardianModel.findById(req.params.id)
    if (!guardian) {
        return next(new Error(`guardian not found`, { cause: 404 }))
    }
    return res.status(200).json({ message: "Done", guardian })
})
//update guardian
export const updateGuardian = asyncHandler(async (req, res, next) => {
    const guardian= await guardianModel.findByIdAndUpdate(req.guardian._id,
        req.body, { new: true });
    if (!guardian) {
        return next(new Error(`guardian not found `, { cause: 404 }))
    }
    return res.status(200).json({ message: "Done updated" })
})
//delete guardian
export const deleteGuardian = asyncHandler(async (req, res, next) => {
    const { guardianId } = req.params
 //   const guardian= await guardianModel.findByIdAndDelete(req.params.id);
 const guardian= await guardianModel.findByIdAndDelete(guardianId);
      
 if (!guardian) {
        return next(new Error(`guardian not found `, { cause: 404 }))
    }
    return res.status(200).json({ message: "Done guardian deleted", })
})







//addPatient
export const addPatient = asyncHandler(async (req, res, next) => {
    const { patientId } = req.params;
     console.log({ patientId });
    const patient = await patientModel.findById(patientId)
    if (!patient) {
     return next(new Error("Not jjj register account", { cause: 404 }))
    }
    if (!patient.isLogin) {
        return next(new Error("No login", { cause: 404 }))
    
    }
    const guardian = await guardianModel.findById(req.guardian._id)

   // patient.guardianIds = [req.guardian._id]
    patient.guardianIds.push([req.guardian._id])
   
    await patient.save()
    return res.status(201).json({ message: 'Done', patient })
})








//all guardian
