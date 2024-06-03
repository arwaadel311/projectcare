import { Router } from "express";

import * as patientController from "./controller/patient.js"
import * as validators from './patient.validation.js'
import {validation} from'../../middleware/validation.js'
import { authPatient } from "../../middleware/auth.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";

const router = Router()

router.get("/http", (req,res)=>{
    return res.json( req.protocol )
})
//all patient
router.get("/",patientController.patients)
//get patient by Id
router.get("/getById/:id",patientController.patientById)

//update patient
//router.put('/update/:patientId', patientController.updatePatient);
router.put('/update',authPatient, patientController.updatePatient);


//delete patient
router.delete('/:patientId',authPatient, patientController.deletePatient);
//router.delete('/delete',authPatient, patientController.deletePatient);

//signup
router.post('/signupPatient',

fileUpload(fileValidation.image).none(),
validation(validators.signUpPatient),
patientController.signupPatient)
//login
router.post('/loginPatient',

fileUpload(fileValidation.image).none(),
validation(validators.loginPatient),
patientController.loginPatient)
//logout

router.post('/logoutPatient',authPatient,
patientController.logoutPatient)
//confirm email
router.put('/confirmEmailPatient',
validation(validators.sendCodeEmail),
patientController.confirmEmailPatient)


//profile
router.get("/home/profile",authPatient,patientController.profilePatient)


router.patch("/patientQR",authPatient,patientController.QRPatient)

//router.get("/patientQR/:patientId",patientController.QRPatient)
router.get("/QR/:patientId",patientController.GetQRPatient)

router.patch("/sendCodeEmail",
validation(validators.sendCodeEmailAgain),
patientController.sendCodeEmail)
 


router.post('/forgetPassword',

validation(validators.sendCodeForgetPasswordPatient),
patientController.sendCodePatient)


router.put("/checkEmailCodePassword",
validation(validators.CodeForgetPasswordPatient),
patientController.CodeForgetPasswordPatient)


router.patch("/reset/newPassword",

validation(validators.ForgetPassword),
patientController.resetPassword)




//router.patch("/patientQRGuardian",authPatient,patientController.GuardianPatient)
//router.get("/pp/patientQR",patientController.DoctorPatient)
//router.get("/p/QR",authPatient,patientController.patientQr)
// router.get('/NewConfirmEmail/:token',
// validation(validators.token),
// patientController.generateRefreshToken)
// router.patch("/updateForget/PasswordPatient",
// validation(validators.updateForgetPassword),
//patientController.updatePassword)

router.post("/rate/:patientId",patientController.Rate)

router.get("/rate/:patientId",patientController.Rates)


export default router