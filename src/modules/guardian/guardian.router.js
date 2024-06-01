import { Router } from "express";

import * as guardianController from "./controller/guardian.js"
import * as validators from './guardian.validation.js'
import {validation} from'../../middleware/validation.js'
import { authGuardian } from "../../middleware/auth.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";

const router = Router({mergeParams:true})

//all guardian
router.get("/",guardianController.guardians)
//get guardian by Id
router.get("/getById/:id",guardianController.guardianById)
//update guardian
//router.put('/update/:id', guardianController.updateGuardian);

router.put('/update',authGuardian, guardianController.updateGuardian);
//delete guardian
router.delete('/:guardianId',authGuardian, guardianController.deleteGuardian);

//signup
router.post('/signupGuardian',

fileUpload(fileValidation.image).none(),
validation(validators.signUpGuardian),
guardianController.signupGuardian)
//login
router.post('/loginGuardian',

fileUpload(fileValidation.image).none(),
validation(validators.loginGuardian),
guardianController.loginGuardian)




//add patient
router.patch("/:patientId",
authGuardian,guardianController.addPatient)


//logout

router.post('/logoutGuardian',authGuardian,
guardianController.logoutGuardian)
//confirm email
router.put('/confirmEmailGuardian',
validation(validators.sendCodeEmail),
guardianController.confirmEmailGuardian)


//profile
router.get("/home/profile",authGuardian,guardianController.profileGuardian)




router.patch("/sendCodeEmail",
validation(validators.sendCodeEmailAgain),
guardianController.sendCodeEmail)



router.post('/forgetPassword',

validation(validators.sendCodeForgetPasswordGuardian),
guardianController.sendCodeGuardian)


router.put("/checkEmailCodePassword",
validation(validators.CodeForgetPasswordGuardian),
guardianController.CodeForgetPasswordGuardian)


router.patch("/reset/newPassword",

validation(validators.ForgetPassword),
guardianController.resetPassword)

// router.patch("/updateForget/PasswordPatient",
// validation(validators.updateForgetPassword),

// guardianController.updatePassword)



export default router