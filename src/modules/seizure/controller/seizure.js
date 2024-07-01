import { asyncHandler } from "../../../utils/errorHandling.js";

import seizureModel from "../../../../DB/model/seizure.model.js";




export const seizures = asyncHandler(async (req, res, next) => {
    const seizure = await seizureModel.find()
    return res.status(200).json({ message: "Done", seizure })
})