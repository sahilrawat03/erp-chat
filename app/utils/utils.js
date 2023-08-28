'use strict';

const pino = require("pino");
const MONGOOSE = require('mongoose');
const CONSTANTS = require('./constants');
const JWT = require("jsonwebtoken");
const _ = require('lodash');
const AsyncLock = require('async-lock');

// const sessionModel = require('../models/sessionModel');
const { createPinoBrowserSend, createWriteStream } = require("pino-logflare");
const { AWS, SMTP, WEB_URL, ADMIN_WEB_URL, PINO, ENVIRONMENT } = require('../../config');

const PINO_CRED = { apiKey: PINO.API_KEY, sourceToken: PINO.API_SECRET };

const stream = createWriteStream(PINO_CRED); // create pino-logflare stream
const send = createPinoBrowserSend(PINO_CRED); // create pino-logflare browser stream

const awsSnsConfig = {
    accessKeyId: AWS.accessKeyId,
    secretAccessKey: AWS.secretAccessKey,
    region: AWS.awsRegion,
};

let commonFunctions = { };

/**
* Encrypt password in case user login implementation
* @param {*} payloadString 
*/
commonFunctions.hashPassword = (payloadString) => {
    return BCRYPT.hashSync(payloadString, CONSTANTS.SECURITY.BCRYPT_SALT);
};

/**
* @param {string} plainText 
* @param {string} hash 
*/
commonFunctions.compareHash = (payloadPassword, userPassword) => {
    return BCRYPT.compareSync(payloadPassword, userPassword);
};

/**
* function to get array of key-values by using key name of the object.
*/
commonFunctions.getEnumArray = (obj) => {
    return Object.keys(obj).map(key => obj[key]);
};

/** used for converting string id to mongoose object id */
commonFunctions.convertIdToMongooseId = (stringId) => {
    if(!stringId) return stringId;
    return MONGOOSE.Types.ObjectId(stringId);
};

/** create jsonwebtoken **/
commonFunctions.encryptJwt = (payload) => {
    return JWT.sign(payload, CONSTANTS.SECURITY.JWT_SIGN_KEY, { algorithm: 'HS256' });
};

/** decrypt jsonwebtoken **/
commonFunctions.decryptJwt = (token) => {
    return JWT.verify(token, CONSTANTS.SECURITY.JWT_SIGN_KEY, { algorithm: 'HS256' });
};

/**
* function to convert an error into a readable form.
* @param {} error 
*/
commonFunctions.convertErrorIntoReadableForm = (error) => {
    let errorMessage = '';
    if (error.message.indexOf("[") > -1) {
        errorMessage = error.message.substr(error.message.indexOf("["));
    } else {
        errorMessage = error.message;
    }
    errorMessage = errorMessage.replace(/"/g, '');
    errorMessage = errorMessage.replace('[', '');
    errorMessage = errorMessage.replace(']', '');
    error.message = errorMessage;
    return error;
};

/***************************************
**** Logger for error and success *****
***************************************/
commonFunctions.log = {
    info: (data) => {
        console.log('\x1b[33m' + data, '\x1b[0m');
    },
    success: (data) => {
        console.log('\x1b[32m' + data, '\x1b[0m');
    },
    error: (data) => {
        console.log('\x1b[31m' + data, '\x1b[0m');
    },
    default: (data) => {
        console.log(data, '\x1b[0m');
    }
};

/**
* function to get pagination condition for aggregate query.
* @param {*} sort 
* @param {*} skip 
* @param {*} limit 
*/
commonFunctions.getPaginationConditionForAggregate = (sort, skip, limit) => {
    let condition = [
        ...(sort ? [{ $sort: sort }] : []),
        { $skip: skip },
        { $limit: limit }
    ];
    return condition;
};

/**
* function to remove undefined keys from the payload.
* @param {*} payload 
*/
commonFunctions.removeUndefinedKeysFromPayload = (payload = {}) => {
    for (let key in payload) {
        if (!payload[key]) {
            delete payload[key];
        }
    }
};

/**
* Send an email to perticular user mail 
* @param {*} email email address
* @param {*} subject  subject
* @param {*} content content
* @param {*} cb callback
*/
commonFunctions.sendEmail = async (userData, type) => {
    const transporter = require('nodemailer').createTransport(SMTP.TRANSPORT);
    const handleBars = require('handlebars');
    /** setup email data with unicode symbols **/
    const mailData = commonFunctions.emailTypes(userData, type), email = userData.email, ccEmail = userData.ccEmail, bccEmail = userData.bccEmail;
    let template = "";
    let result = "";
    if (mailData && mailData.template) {
        template = handleBars.compile(mailData.template);
    }
    if (template) {
        result = template(mailData.data);
    }

    let emailToSend = {
        to: email,
        cc: ccEmail,
        bcc: bccEmail,
        from: SMTP.SENDER,
        subject: mailData.Subject
    };
    if (type == CONSTANTS.EMAIL_TYPES.FORGOT_PASSWORD_EMAIL) {
        emailToSend.text = userData.token;
    }
    if (type == CONSTANTS.EMAIL_TYPES.SEND_INVITE_EMAIL) {
        emailToSend.html = userData.link;
    }
    if (userData.attachments && userData.attachments.length) {
        emailToSend.attachments = userData.attachments;
    }
    if (result) {
        emailToSend.html = result;
    }
    if (userData.icalEvent) {
        emailToSend.icalEvent = userData.icalEvent;
    }
    return await transporter.sendMail(emailToSend);
};

/**
 * Function to manage email type data.
 * @param {*} user 
 * @param {*} type 
 * @returns 
 */
commonFunctions.emailTypes = (user, type) => {
    let EmailStatus = {
        Subject: '',
        data: {},
        template: ''
    };
    switch (type) {
        case CONSTANTS.EMAIL_TYPES.WELCOME_EMAIL:
            EmailStatus['Subject'] = CONSTANTS.EMAIL_SUBJECTS.WELCOME_EMAIL;
            EmailStatus.template = CONSTANTS.EMAIL_CONTENTS.WELCOME_EMAIL;
            EmailStatus.data['name'] = user.name;
            break;

        case CONSTANTS.EMAIL_TYPES.VERIFICATION_EMAIL:
            EmailStatus['Subject'] = CONSTANTS.EMAIL_SUBJECTS.VERIFICATION_EMAIL;
            EmailStatus.template = CONSTANTS.EMAIL_CONTENTS.VERIFICATION_EMAIL;
            EmailStatus.data['name'] = user.name;
            break;

        case CONSTANTS.EMAIL_TYPES.FORGOT_PASSWORD_EMAIL:
            EmailStatus['Subject'] = CONSTANTS.EMAIL_SUBJECTS.FORGOT_PASSWORD_EMAIL;
            EmailStatus.template = CONSTANTS.EMAIL_CONTENTS.FORGOT_PASSWORD_EMAIL;
            EmailStatus.data['name'] = user.name;
            EmailStatus.data['token'] = user.token;
            break;

        case CONSTANTS.EMAIL_TYPES.ICALENDER_EMAIL:
            EmailStatus['Subject'] = CONSTANTS.EMAIL_SUBJECTS.ICALENDER_EMAIL;
            break;
        
        case CONSTANTS.EMAIL_TYPES.SEND_INVITE_EMAIL:
            EmailStatus['Subject'] = CONSTANTS.EMAIL_SUBJECTS.SEND_INVITE_EMAIL;
            break;    

        default:
            EmailStatus['Subject'] = 'Welcome Email!';
            break;
    }
    return EmailStatus;
};

/**
* function to create reset password link.
*/
commonFunctions.createResetPasswordLink = (userData) => {
    let dataForJWT = { _id: userData._id, Date: Date.now, email: userData.email };
    let baseUrl = (userData.userType == CONSTANTS.USER_TYPE.STAFF) ? WEB_URL : ADMIN_WEB_URL;
    let resetPasswordLink = baseUrl + '/reset-password/' + commonFunctions.encryptJwt(dataForJWT);
    return resetPasswordLink;
};

/**
* function to generate random otp string
*/
commonFunctions.generateOTP = (length) => {
    let chracters = '0123456789';
    let randomString = '';
    for (let i = length; i > 0; --i)
        randomString += chracters[Math.floor(Math.random() * chracters.length)];

    return randomString;
};

/** -- function to returns a random number between min and max (both included) */
commonFunctions.getRandomInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
* function to sent sms via AWS-SNS
* @param {receiver} phoneNumber
* @param {content} SMS 
*/
commonFunctions.sendSms = async (receiver, content) => {
    let msg = {
        "message": content,
        "sender": AWS.smsSender || 'Backend Team',
        "phoneNumber": receiver
    };
    let smsResponse = await awsSms(awsSnsConfig, msg);
    return smsResponse;
};

// Function to generate expiry time in seconds
commonFunctions.generateExpiryTime = (seconds) => {
    return new Date(new Date().setSeconds(new Date().getSeconds() + seconds));
};

/**
 * Function to add delay
 * @param {*} delay 
 * @returns 
 */
commonFunctions.addDelay = async (delay) => {
    return new Promise((resolve) => setTimeout(() => resolve(), delay));
};

/**
 * function to convert seconds in HMS string
 * @param {*} value 
 * @returns 
 */
commonFunctions.convertSecondsToHMS = (value) => {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    str = '';
    if (hours) str = str + hours + (hours > 1 ? ' Hours' : ' Hour');
    if (minutes) str = str + ' ' + minutes + (minutes > 1 ? ' Minutes' : ' Minute');
    if (seconds) str = str + ' ' + seconds + (seconds > 1 ? ' Seconds' : ' Second');

    return str.trim();
};

/**
 * Variable to create logging
 */
commonFunctions.logger = () => {

    if(PINO.IS_ACTIVE){
        pino({
            browser: {
                transmit: {
                    send,
                },
            }
        }, stream
        );
    }

};

/**
 * function to create session
 * @param {*} payload 
 * @returns 
 */
commonFunctions.createSession = async (payload) => {
    let sessionData = {};

    sessionData.token = commonFunctions.encryptJwt({
        userId: payload.userId,
        date: Date.now()
    });

    if(payload.tokenType === CONSTANTS.TOKEN_TYPES.OTP){
        sessionData.token = commonFunctions.generateOTP(CONSTANTS.OTP_LENGTH);
        sessionData.tokenExpDate = commonFunctions.generateExpiryTime(CONSTANTS.OTP_EXPIRIED_TIME_IN_SECONDS || 10);
    }

    if (ENVIRONMENT === 'development' || payload.tokenType != CONSTANTS.TOKEN_TYPES.LOGIN) {
        sessionData = {
            ...sessionData,
            userId: payload.userId,
            userType: payload.userType,
            tokenType: payload.tokenType || CONSTANTS.TOKEN_TYPES.LOGIN
        };
    }
    return sessionData.token;
};

/**
 * Function to suffle data.
 * @param {*} dataToSuffle 
 * @returns 
 */
commonFunctions.shuffleData = (dataToSuffle) => { 
    return _.shuffle(dataToSuffle);
};

/**
 * Function t lock function.
 * @param {*} lockKeys 
 * @param {*} funtionToExecute 
 * @param {*} functionCallData 
 * @returns 
 */
commonFunctions.lockFunction = async (lockKeys, funtionToExecute, functionCallData = []) => {

    let lock = new AsyncLock(), data;
    await lock.acquire( lockKeys, async function (done) { 
        data = await funtionToExecute(...functionCallData);
        done();
    }, {});

    return data;
};

module.exports = commonFunctions;