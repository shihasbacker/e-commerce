var dotenv = require('dotenv');
const { nextTick } = require('process');
dotenv.config();

var process = require('process')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const ServiceSID = process.env.TWILIO_SERVICE_SID;
const client = require('twilio')(accountSid, authToken, ServiceSID);

exports.sendOtp = async (userData) => {
    const data = await client.verify.v2.services(ServiceSID).verifications.create({
        to: `+91${userData.phoneNumber}`,
        channel: 'sms'
    })
}

exports.verifyOtp = (otpData, userData) => {

    return new Promise(async (resolve, reject) => {
        await client.verify.services(ServiceSID).verificationChecks.create({
            to: `+91${userData.phoneNumber}`,
            code: otpData
        }).then((verifications) => {
            resolve(verifications.valid)
        });
    })
}