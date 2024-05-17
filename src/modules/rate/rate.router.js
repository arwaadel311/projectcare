import { Router } from "express";
import * as rateController from "./controller/rate.js"



const router = Router()


router.get("/",rateController.Rates)

router.post("/",rateController.createRate)
//router.get("/seizureLocation",seizureController.sendLocation)
export default router