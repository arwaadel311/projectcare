
import { Router } from "express";

import * as adminController from "./controller/admin.js"
import { validation } from "../../middleware/validation.js";

import * as validators from './admin.validation.js'
import { authAdmin } from "../../middleware/auth.js";


const router = Router()
//get Admin
router.get("/",adminController.admin)


//login
router.post('/loginAdmin',
validation(validators.loginAdmin),
adminController.loginAdmin)

//update isApproved true 
router.put('/approve/adminTrue/:doctorId', authAdmin, 
adminController.approveAdmin)


//get all doctor isApproved false

router.get('/isApprovedFalse',authAdmin,
adminController.GetAllDoctorsApprovedFalse)


router.get('/allDoctor',authAdmin,
adminController.GetAllDoctor)

router.get('/allPatient',authAdmin,
adminController.GetAllPatient)

router.delete('/:doctorId',authAdmin,
adminController.deleteDoctor)

router.delete('/delete/:patientId',authAdmin,
adminController.deletePatient)

router.delete('/del/:guardianId',authAdmin,
adminController.deleteGuardian)

router.get('/allGuardian',authAdmin,
adminController.GetAllGuardian)



//signUp
router.post('/signUpAdmin',
//validation(validators.Admin),
adminController.signUpAdmin)

export default router