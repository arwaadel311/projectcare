
import { hash, compare } from '../../../utils/HashAndCompare.js'
import { generateToken, verifyToken } from '../../../utils/GenerateAndVerifyToken.js'
import sendEmail from '../../../utils/email.js'
import { asyncHandler } from '../../../utils/errorHandling.js'
import patientModel from '../../../../DB/model/patient.model.js'
import QRCode from "qrcode"
import doctorModel from '../../../../DB/model/doctor.model.js'
import adminModel from '../../../../DB/model/admin.model.js'
import guardianModel from '../../../../DB/model/guardian.model.js'
import seizureModel from '../../../../DB/model/seizure.model.js'

import { initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import admin from "firebase-admin";




const credential = {
    type: "service_account",
    project_id: "test-app-9e997",
    private_key_id: "03afb81496732da467038c022593ce3dcfeb33b4",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC5CasOvo3sEwFS\npyTWSIWnX36I0sukDEUkmKRdgxMFG4RBQhhhLCqdQmb5ICfZvxNJfmOPHzgzyMk2\nlDTIAxbj/oKfvz9Hiorht1KYxg2NetiHtCUbrlIt8qy3M9Z50nV/dDZhdE4Ozz5y\nALiJWFbwOYjsap16w6wH+YV0RgspIlfETwAXVIpK5DE7cw6j+knpM2KzddKMcetX\nCCdbVtyZ7i97Yu4VFJA3bweCOuo+Gw4uCNtfmv8a1gmgfLJp56IoC6gPK9wpA+Fn\naPTP1hlQl4WudJRdnRrLwaTkcWnSb9Q9pn53rs/fRSRFNzvLS4B/2i2dVkwf58Ee\nCwy/3izZAgMBAAECggEAA/Mv4p2wu+Rf99q3j5d2uu7v7Y3KaRMV+sUDZTeiFU7U\nEOyPRqvBsR+0wQatsxlAGSaIi4qYEYrsuKyLP+XI/E73jN9xQ16yvkTCj55Stb10\nl9kBncin2nE+vJ5vqqQSfAkIDCaGcAx+gcKALfZjzLb9tEZGXFOG/ZiW/7drD5Kx\nvlSN5Fowgz6ASfTVOFrvgSkZMYqU2yjkh289PmRfVZLwxr55X+9MRCY0UfKPo1VY\nXzBekXrXoao7Uxf87H0r70U0d7nSf/bLnBMQi6dE/xNWkR9gD1/TqQThe3BUe8Qp\nUYULr7Fit/kKnc5fndRf80hcWDRe6pgLBlgHdJn/gQKBgQD19LBH1Agx/olPCueE\ncBls3EPynGBP4ByhtdPl8sQfz+SzOibykiDwBLy/OQQiAQarnTNAmJc6KMvEt60x\nrmeHDXroohD1UWxvKcpqlk9b/TTABAguEYCIrgJa6OKbatuKIF417x+7V/abPES+\n1+98FkdQ8pLmduhr06AED56NEQKBgQDAmB7FRamCrA4dNgMufcbnpW/Unc3jtD9i\n0nhix503xFBrqSAlhh9StlyO5Dn4BIoZo4vnqO35L+o/ixBHAQSxzg0LYPmOf4U5\nuKWQIcWRh0sMlKiRthUP22gYVZ9KFjbzQOX7LWr0zlmW+EwTJX/sUhglNbQBBfZv\nwM0m8vTDSQKBgQC6eMwZeQjJlphVpAfJIhA0t36QdryScnBire88XGUTVVOoCoOy\nztVIA99x/vFCMpLzE5ji9Y1aG8n5l+QoUXjOLIstyome5B+Y3A9J5jG+pWcT2Tq2\narCPb5X7hKshd8+Alm+25lehetxN71CTfDVmV6G0HmT/c9FcxrJ/wbPMcQKBgQC8\nnv9b4zr94HY+Q5zgFo0MZ+lbiWWQwgJmTY1b6PXgHSNKHax/M5lPz4xc4caoUgHS\n1Gr76mWO7E92BkNd1vB7FzuNTl97IQcgneeAfqLZQXDOFHX3pyV/jzmmw4yq6ZDN\nslzLIBMlSUdS5UDUa6CamVhOcQcnDWjq0B/cKoxvCQKBgA1KrKd73PnKf9GTmRff\nmiB1lyrRWKsM4/tM6F2Ydd46aTd2bc7uOCfyCHRrpsGj7Uqr0Kh8bHJlWxO06gMT\nFOUiUjBJMFBbp4QTKYyjzidkmuEAEZV12MSG6Oj2tFem2Ew+SKpmwQRPx7vDccR3\no+rbOm+tMoxtq8WVshtkgj/W\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-lzr26@test-app-9e997.iam.gserviceaccount.com",
    client_id: "116241382066845598417",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-lzr26%40test-app-9e997.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  };
  
  const firebaseConfig = {
    credential: admin.credential.cert(credential),
  };
  
  const firebaseApp = initializeApp(firebaseConfig),
    messaging = getMessaging(firebaseApp);




    
//post Hardware Rate
export const Rate = asyncHandler(async (req, res, next) => {
    const { heartRate, motionRate,currentMotionRate } = req.body
    const { patientId } = req.params
    const patient = await patientModel.findById(patientId)
    if (!patient) {
        return next(new Error("Not register account", { cause: 404 }))
    }
    patient.heartRate = heartRate
    patient.motionRate = motionRate
    patient.currentMotionRate=currentMotionRate
    await patient.save()
    if (patient.heartRate > 130 || patient.heartRate <50 && patient.motionRate>2) {
        


        const patientDoctor=await doctorModel.findOne({patientId:patientId})
        
        const DocToken=patientDoctor.docToken

        const patientGuardian=await guardianModel.findOne({patientId:patientId})


        const GurToken=patientGuardian.gurToken

        const tokens=[DocToken,GurToken]

        const firebaseMessage = {
            topic:"alarmNotification",
         
            android: {
           
            notification: {
              title: "Title here",
              body: "Body here",
              visibility: "public",
              channelId: "basic_channel",
              sound: "alarm",
              color: "#000000",
              
            },
            data: { test: "test data" },
           
          },
        };
        
    
        try {
            await messaging.subscribeToTopic(tokens,"alarmNotification"); 
          await messaging.send(firebaseMessage);
        
        } catch (err) {
          console.log("firebase messaging error:", err);
        }




        const patientSeizure = await seizureModel.create({
            heartRate, motionRate, patientId: patientId 
        })
      
        if (patientSeizure.type==1) {
        patient.seizureHistory.push(patientSeizure)
        }
        
        await patient.save()
       
      //  return res.status(200).json({ message: "Done", patientSeizure })
 }
    return res.status(200).json({ message: "Done", patient })

})

//all patient
export const patients = asyncHandler(async (req, res, next) => {
    const patient = await patientModel.find().select('-password -confirmEmail -emailCode -verifyEmail -EmailPasswordCode -isLogin')
        .populate({ path: 'doctorId', select: 'firstName lastName email clinicAddress phone_one' })
        .populate({ path: 'guardianIds', select: 'firstName lastName email  phone_one' })

        .populate({ path: 'seizureHistory', select: ' heartRate motionRate Time lng lat' })
    return res.status(200).json({ message: "Done", patient })
})
//signUp
export const signupPatient = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, gender, homeAddress, phone_one, phone_two, birthDate } = req.body
    const checkPatient = await patientModel.findOne({ email: email.toLowerCase() })
    const checkDoctor = await doctorModel.findOne({ email: email.toLowerCase() })
    const checkAdmin = await adminModel.findOne({ email: email.toLowerCase() })
    const checkGuardian = await guardianModel.findOne({ email: email.toLowerCase() })
    if (checkPatient) {
        return next(new Error(`Email exist`, { cause: 409 }))
    }
    if (checkPatient !== checkDoctor) {
        return next(new Error(`duplicated Doctor email`, { cause: 409 }))
    }

    if (checkPatient !== checkAdmin) {
        return next(new Error(`duplicated Admin email`, { cause: 409 }))
    }
    
    if (checkPatient !== checkGuardian) {
        return next(new Error(`duplicated guardian email`, { cause: 409 }))
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

    const { _id } = await patientModel.create({
        firstName, lastName, email,
        emailCode,
        password: hashPassword
        , gender, homeAddress,
        
        phone_one, phone_two, birthDate
    })
    return res.status(201).json({ message: "Done", _id })
})
//confirm Email
export const confirmEmailPatient = asyncHandler(async (req, res, next) => {
    const { emailCode } = req.body
    const patient = await patientModel.findOne({ emailCode })
    if (!patient) {
        return next(new Error('In-valid account', { cause: 400 }))
    }
    if (patient.emailCode !== parseInt(emailCode)) {
        return next(new Error('In-valid reset code', { cause: 400 }))
    }
    patient.emailCode = null;
    patient.confirmEmail = true
    await patient.save()
    return res.status(200).json({ message: "Done" })
})
//login
export const loginPatient = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body
    //check email exist
    const patient = await patientModel.findOne({ email: email.toLowerCase() })

    if (!patient) {
        return next(new Error(`email not exist`, { cause: 404 }))
    }
    if (!patient.confirmEmail) {
        return next(new Error(`please confirm your Email first.`, { cause: 400 }))
    }
    const match = compare({ plaintext: password, hashValue: patient.password })
    if (!match) {
        return next(new Error(`IN-valid login data`, { cause: 400 }))
    }
    const access_Token = generateToken({
        payload: { id: patient._id },

        //expiresIn: 60 * 30 //1h
        expiresIn: 60 * 60 * 24 * 30 * 12  
    })


    const refresh_token = generateToken({
        payload: { id: patient._id },

        expiresIn: 60 * 60 * 24 * 365
    })


    const patientID_token = { id: patient._id }

    patient.isLogin = true
    patient.status = 'online'
    await patient.save()
    return res.status(200).json({
        message: "Done",
        access_Token,

        refresh_token,

        patientID_token
    })
})
//logout
export const logoutPatient = asyncHandler(async (req, res, next) => {

    const patient = await patientModel.updateOne({ _id: req.patient._id }, { status: 'offline', isLogin: 'false' })

    return res.status(200).json({ message: "Done is logout" })
})
//profile
export const profilePatient = asyncHandler(async (req, res, next) => {
    const patient = await patientModel.findById(req.patient._id)
    return res.json({
        message: "DDDDDDDDone",
        patient
    })
})
// Generate QR Patient 
export const QRPatient = asyncHandler(async (req, res, next) => {
    const patient = await patientModel.findById(req.patient._id)
    QRCode.toDataURL(`${req.protocol}://${req.headers.host}/caregivers/${req.patient._id}`,
        { type: 'terminal' },

        function (err, url) {
            return res.json({

                message: "Done QR",
                url,
                link: `${req.protocol}://${req.headers.host}/caregivers/${req.patient._id}`,
            })
        })
        //console.log(url);

       // console.log(req.protocol);        
})

// Generate QR Patient 
export const GetQRPatient = asyncHandler(async (req, res, next) => {
    const{patientId}=req.params
    const patient = await patientModel.findById(patientId)
    QRCode.toDataURL(`${req.protocol}://${req.headers.host}/caregivers/${patientId}`,
        { type: 'terminal' },

        function (err, url) {
            return res.json({

                message: "Done QR",
                url,
                link: `${req.protocol}://${req.headers.host}/caregivers/${patientId}`,
            })
        })
        //console.log(url);

        //console.log(req.protocol);
    })
//send code email Again
export const sendCodeEmail = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const emailCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    const patient = await patientModel.findOneAndUpdate({ email: email.toLowerCase() }, { emailCode })
    if (!patient) {
        return next(new Error('In-valid account', { cause: 400 }))

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
export const sendCodePatient = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const patient = await patientModel.findOne({ email: email.toLowerCase() })
    if (!patient) {
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
    patient.EmailPasswordCode = EmailPasswordCode;

    await patient.save()

    return res.status(200).json({ message: "Done" })
})
//check your email verifyCode forgetPassword
export const CodeForgetPasswordPatient = asyncHandler(async (req, res, next) => {
    const { EmailPasswordCode } = req.body

    const patient = await patientModel.findOne({ EmailPasswordCode })
    if (!patient) {
        return next(new Error('In-valid account', { cause: 400 }))
    }
    if (patient.EmailPasswordCode !== parseInt(EmailPasswordCode)) {
        return next(new Error('In-valid reset code', { cause: 400 }))
    }
    patient.EmailPasswordCode = null;
    patient.verifyEmail = true
    await patient.save()
    return res.status(200).json({ message: "Done" })
})
// forgetPassword set a new password
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { newPassword } = req.body;


    const patient = await patientModel.findOne({ verifyEmail: true })
    if (!patient) {
        return next(new Error('In-valid account', { cause: 400 }))
    }
    if (patient.verifyEmail != true) {
        return next(new Error('In valid verify email'))
    }
    const hashPassword = hash({ plaintext: newPassword });
    patient.password = hashPassword;
    patient.verifyEmail = false
    await patient.save();
    return res.status(200).json({ message: "Done reset", newPassword });
})
//Get patient by Id
export const patientById = asyncHandler(async (req, res, next) => {

    const patient = await patientModel.findById(req.params.id)
    if (!patient) {
        return next(new Error(`Patient not found`, { cause: 404 }))
    }
    return res.status(200).json({ message: "Done", patient })
})
//update patient
export const updatePatient = asyncHandler(async (req, res, next) => {
    const patient = await patientModel.findByIdAndUpdate(req.patient._id, req.body, { new: true });
    if (!patient) {
        return next(new Error(`patient not found `, { cause: 404 }))
    }
    return res.status(200).json({ message: "Done updated" })
})



//delete Patient account

export const deletePatient = asyncHandler(async (req, res, next) => {
    const {patientId}=req.params


    
const doctors = await doctorModel.find({patientId:patientId});

if (doctors.length > 0) {
    doctors.forEach((doctor) => {
        doctor.patientId.pull(patientId);
        doctor.save();
    });
  }
  // console.log(doctors);

    
    const guardians = await guardianModel.find({patientId:patientId});
    
if (guardians.length > 0) {
    guardians.forEach((guardian) => {
        guardian.patientId.pull(patientId);
        guardian.save();
    });
  }
   //console.log(guardians);

    const patient = await patientModel.findByIdAndDelete(patientId);
    if (!patient) {
        return next(new Error(`Patient not found `, { cause: 404 }))
    }
    return res.status(200).json({ message: "Done patient deleted", })
})





export const sendLocation = asyncHandler(async (req, res, next) => {
    const {lat,lng}=req.body
        const patient = await patientModel.findById(req.patient._id)
        if (!patient) {
            return next(new Error("Not register account", { cause: 404 }))
        }
        const patientSeizure = await patientModel.findById(req.patient._id)
        
        patientSeizure.lat=lat
        patientSeizure.lng=lng
        patientSeizure.save()
    //     const patientSeizurePP = await patientModel.findOne(req.patient._id)
    // console.log(patientSeizurePP);
        return res.status(200).json({ message: "Done",patientSeizure})
    
    })
    







// //update patient
// export const updatePatient = asyncHandler(async (req, res, next) => {
//     const patient = await patientModel.findByIdAndUpdate(req.params.patientId,
//         req.body, { new: true });
//     if (!patient) {
//         return next(new Error(`Patient not found `, { cause: 404 }))
//     }
//     return res.status(200).json({ message: "Done updated" })
// })

















// export const updatePassword = asyncHandler(async (req, res, next) => {
//     const { email, newPassword } = req.body
//     const patient = await patientModel.findOne({  email: email.toLowerCase() })
//     const hashPassword = hash({ plaintext: newPassword })
//     patient.password = hashPassword;
//     await patient.save();
//     return res.status(200).json({ message: "Done" })
// })





// export const  patientQr= asyncHandler(async (req, res, next) => {
//     const patient = await patientModel.findById(req.patient._id)
//     //  const doctor = await doctorModel.findById(req.doctor._id)
//    const qrCode = QRCode.toDataURL(`${req.protocol}://${req.headers.host}/doctor/${req.patient._id}`,

//     //const qrCode = QRCode.toString(`${req.protocol}://${req.headers.host}/doctor/${req.patient._id}`,
//         { type: 'terminal' },
//         function (err, url) {


//             return res.json({
//                 message: "Dooone",
//                 patient,

//             })


//         })
// })


//all patient

// // Generate QR Patient to Guardian
// export const GuardianPatient = asyncHandler(async (req, res, next) => {
//     const patient = await patientModel.findById(req.patient._id)
//     QRCode.toDataURL(`${req.protocol}://${req.headers.host}/guardian/${req.patient._id}`,
//         { type: 'terminal' },

//         function (err, url) {

//             return res.json({

//                 message: "Done QR",
//                 url,
//                 link: `${req.protocol}://${req.headers.host}/guardian/${req.patient._id}`,
//             })
//         })
// })





//get rates
export const Rates = asyncHandler(async (req, res, next) => {

    const { patientId } = req.params
    const patient = await patientModel.findById(patientId)
    if (!patient) {
        return next(new Error("Not ooregister account", { cause: 404 }))
    }
    return res.status(200).json({ message: "Done", HR: patient.heartRate, MR: patient.motionRate })

})

// export const generateRefreshToken = asyncHandler(async (req, res, next) => {


//     const { token } = req.params
//     const { email } = verifyToken({ token, signature: process.env.EMAIL_TOKEN })
//     if (!email) {
//         return next(new Error('In-valid token payload', { cause: 400 }))
//         // return res.status(200).redirect(`${process.env.FE_URL}/#/In-validEmail`)
//         // return res.status(400).json({ message: "invalid token payload", })

//     }
//     const patient = await patientModel.findOne({ email: email.toLowerCase() })
//     if (!patient) {
//         return next(new Error("Not register account", { cause: 400 }))
//         //  return res.status(404).json({ message: "Not register account", })

//     }
//     if (!patient.confirmEmail) {
//         return res.status(404).json({ message: "Not confirm email", })
//     }
//     const newToken = generateToken({ payload: { email }, signature: process.env.EMAIL_TOKEN, expiresIn: 60 * 2 })


//     const link = `${req.protocol}://${req.headers.host}/patient/confirmEmail/${newToken}`
//     const rfLink = `${req.protocol}://${req.headers.host}/patient/NewConfirmEmail/${token}`

//     const html = `<!DOCTYPE html>
//     <html>
//     <head>
//         <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
//     <style type="text/css">
//     body{background-color: #88BDBF;margin: 0px;}
//     </style>
//     <body style="margin:0px;"> 
//     <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
//     <tr>
//     <td>
//     <table border="0" width="100%">
//     <tr>
//     <td>
//     <h1>
//         <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
//     </h1>
//     </td>
//     <td>
//     <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
//     </td>
//     </tr>
//     </table>
//     </td>
//     </tr>
//     <tr>
//     <td>
//     <table border="0" cellpadding="0"  style="text-align:center;width:100%;background-color: #fff;">
//     <tr>
//     <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
//     <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
//     </td>
//     </tr>
//     <tr>
//     <td>
//     <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
//     </td>
//     </tr>
//     <tr>
//     <td>
//     <p style="padding:0px 100px;">
//     </p>
//     </td>
//     </tr>
//     <tr>
//     <td>
//     <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
//     <br>
//     <br>
//     <br>
//     <br>
//     <a href="${rfLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Request new email</a>
    
//     </td>
//     </tr>
    
//     </table>
//     </td>
//     </tr>
//     <tr>
//     <td>
//     <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
//     <tr>
//     <td>
//     <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
//     </td>
//     </tr>
//     <tr>
//     <td>
//     <div style="margin-top:20px;">


//     </div>
//     </td>
//     </tr>
//     </table>
//     </td>
//     </tr>
//     </table>
//     </body>
//     </html>`
//     if (!await sendEmail({ to: email, subject: 'confirmation-email', html })) {

//         return next(new Error("fail to send this Email", { cause: 400 }))
//         //  return res.status(400).json({ message: "fail to send", })

//     }
//     // return res.status(200).redirect(`${process.env.FE_URL}/#/ConfirmEmail`)
//     return res.status(200).send('<h1>New Confirmation Email have been to your inbox please check it asap</h1>')

// })
