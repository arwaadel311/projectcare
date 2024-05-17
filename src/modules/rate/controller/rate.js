import { asyncHandler } from "../../../utils/errorHandling.js"

import rateModel from '../../../../DB/model/rate.model.js'

export const Rates = asyncHandler(async (req, res, next) => {
    const rate = await rateModel.find()

    
    return res.status(200).json({ message: "Done", rate })

})
export const createRate = asyncHandler(async (req, res, next) => {
    const { heartRate, motionRate } = req.body
    const rates = await rateModel.create(
        {heartRate, motionRate}
)
    
    return res.status(201).json({ message: "Done rate", rates })

})