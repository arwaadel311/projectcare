import { Router } from "express";
import * as seizureController from "./controller/seizure.js"



const router = Router()


router.get("/seizure",seizureController.seizures)


router.post("/seizurePatient/:patientId",seizureController.createSeizure)
//router.get("/seizureLocation",seizureController.sendLocation)
export default router