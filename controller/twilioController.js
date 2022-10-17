var dotenv = require('dotenv');
dotenv.config();

var process = require('process')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const ServiceSID = process.env.TWILIO_SERVICE_SID;
const client = require('twilio')(accountSid, authToken, ServiceSID);

exports.sendOtp = async (userData) => {
    try {
        const data = await client.verify.v2.services(ServiceSID).verifications.create({
            to: `+91${userData.phoneNumber}`,
            channel: 'sms'
        })
    } catch (error) {
        console.log(error)
    }
}

exports.verifyOtp = (otpData, userData) => {
//    console.log("ethi",phone,otp)
//     try {
//         const data = await client.verify.v2.services(ServiceSID).verificationChecks.create({
//             to: `+91${phone}`,
//             code: otp
//         })
//         return data

//     } catch (error) {
//         console.log(error)
//     }

    console.log(otpData);
    console.log(userData.phoneNumber); 
   
    return new Promise(async(resolve,reject)=>{
        await client.verify.services(ServiceSID).verificationChecks.create({
            to: `+91${userData.phoneNumber}`,
            code: otpData
        }).then((verifications) => {
            console.log(verifications);
            resolve(verifications.valid)
        });
    })
}