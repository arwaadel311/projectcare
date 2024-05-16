import { Router } from "express";
import * as doctorController from "./controller/doctor.js"
import {fileUpload,fileValidation} from '../../utils/multer.js'
import * as validators from './doctor.validation.js'
import {validation} from'../../middleware/validation.js'
import {authDoctor } from "../../middleware/auth.js";
//import { endPoint } from "./doctor.endPoint.js";

const router = Router()

//get all Doctors
router.get("/",doctorController.doctors)
//get doctor by id
router.get("/getById/:id",doctorController.doctorById)
// //update doctor
// router.put('/update/:doctorId',doctorController.updateDoctor);
router.put('/update',authDoctor,doctorController.updateDoctor);
//delete doctor
router.delete('/:doctorId',authDoctor, doctorController.deleteDoctor);

//router.delete('/delete', authDoctor,doctorController.deleteDoctor);

//profile
router.get("/home/profile",
authDoctor,doctorController.profile)





// //add patient
// router.patch("/:patientId",
// authDoctor,doctorController.addPatient)
//router.get("/getPatients/pp/:doctorId",authDoctor,doctorController.getDataPatient)


//get data after scan qrPatient 
router.get("/getPatients",authDoctor,doctorController.getDataPatients)

router.get("/getHistory",authDoctor,doctorController.getHistorySeizures)

router.get("/getHistory/:patientId",authDoctor,doctorController.getHistorySeizure)
router.get("/getOnePatient/:patientId",authDoctor,doctorController.getDataOnePatient)



//signUp
router.post('/signupDoctor',

fileUpload(fileValidation.image).fields([
    { name: 'certificate', maxCount: 1 },
    { name: 'unionCard', maxCount: 1 }
]),
validation(validators.signUpDoctor),
doctorController.signupDoctor)
//login
router.post('/loginDoctor',
validation(validators.loginDoctor),
doctorController.loginDoctor)
//logout

router.post('/logoutDoctor',authDoctor,
doctorController.logoutDoctor)


router.put('/confirmEmail',
validation(validators.confirmEmail),
doctorController.confirmEmailDoctor)

router.patch("/sendCode/EmailConfirm",
validation(validators.sendCodeEmailAgain),
doctorController.sendCodeEmail)

router.post("/forgetPassword",
validation(validators.sendCodeForgetPasswordDoctor),
doctorController.sendCodeDoctor)



router.put("/checkEmailCodePassword",
validation(validators.CodeForgetPasswordDoctor),
doctorController.CodeForgetPasswordDoctor)



router.patch("/reset/newPassword",
validation(validators.changePassword),
doctorController.resetPassword)

router.patch("/updatePassword/change",authDoctor,
validation(validators.updateForgetPassword),
doctorController.updatePassword)

export default router







// router.get('/NewConfirmEmail/:token',
// validation(validators.token),
// doctorController.generateRefreshToken)