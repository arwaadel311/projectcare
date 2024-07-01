import { Router } from "express";
import * as seizureController from "./controller/seizure.js"



const router = Router()


router.get("/seizure",seizureController.seizures)


export default router