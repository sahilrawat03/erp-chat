'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const CONFIG = require('../../config');
const { FILE_UPLOAD_TYPE } = require('../utils/constants');
const { createErrorResponse } = require('../helpers');
const { MESSAGES, ERROR_TYPES } = require('../utils/constants');

AWS.config.update({ accessKeyId: CONFIG.S3_BUCKET.accessKeyId, secretAccessKey: CONFIG.S3_BUCKET.secretAccessKey });
let s3Bucket = new AWS.S3();

const fileUploadService = {};

/**
 * Function to upload zip file on s3
 * @param {*} payload 
 * @param {*} s3Path 
 */
fileUploadService.extractZipFile = async (payload, s3Path) => {
    /** -- create folders */
    if (!fs.existsSync('data/zips')){
        fs.mkdirSync('data/zips', { recursive: true });
    }
    if (!fs.existsSync('data/unzip')){
        fs.mkdirSync('data/unzip');
    }

    const destPath = path.resolve('./data/zips', `${s3Path}.zip`);
    fs.writeFileSync(destPath, payload.file.buffer);
    await fs.createReadStream(destPath).pipe(unzipper.Extract({ path: `./data/unzip/${s3Path}` })).promise();

    function walkSync(currentDirPath, callback) {

        new Promise(async (resolve, reject) => {
            let directoryList = fs.readdirSync(currentDirPath);

            for (let index = 0; index < directoryList.length; index++) {
                let filePath = path.join(currentDirPath, directoryList[index]);
                let stat = fs.statSync(filePath);

                if (stat.isFile()) {
                    callback(filePath).then(resolve()).catch(reject());
                } else if (stat.isDirectory()) {
                    walkSync(filePath, callback);
                }
            }
        });
    }
    
    walkSync( path.join(__dirname, `../../data/unzip/${s3Path}`), function (filePath) {
        let params = { Bucket:  CONFIG.S3_BUCKET.bucketName, Key: `theme/${s3Path}/${filePath.split('/').pop()}`, Body: fs.readFileSync(filePath) };

        return new Promise((resolve, reject) => {
            s3Bucket.upload(params, (err, data) => {
                if(err) reject();
                resolve();
            });
        });
    });

    fs.rmSync(`./data/unzip/${s3Path}`, { recursive: true, force: true });
    fs.rmSync(`./data/zips/${s3Path}.zip` );
};

/**
 * function to upload a file to s3(AWS) bucket.
 */
fileUploadService.uploadFileToS3 = (payload, fileName, bucketName) => {
    return new Promise((resolve, reject) => {
        s3Bucket.upload({
            Bucket: bucketName,
            Key: fileName,
            Body: payload.file.buffer,
            ContentType: payload.file.mimetype
            // ACL: 'public-read',
        }, function (err, data) {
            if (err) {
                console.log('Error here', err);
                return reject(err);
            }
            resolve(data.Key);
            // resolve(data.Location);
        });
    });
};

/**
 * function to upload file to local server.
 */
fileUploadService.uploadFileToLocal = async (payload, fileName, pathToUpload, pathOnServer) => {
    let directoryPath = pathToUpload ? pathToUpload : path.resolve(__dirname + `../../..${CONFIG.PATH_TO_UPLOAD_SUBMISSIONS_ON_LOCAL}`);
    // create user's directory if not present.
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }
    let fileSavePath = `${directoryPath}/${fileName}`;
    let writeStream = fs.createWriteStream(fileSavePath);
    return new Promise((resolve, reject) => {
        writeStream.write(payload.file.buffer);
        writeStream.on('error', function (err) {
            reject(err);
        });
        writeStream.end(function (err) {
            if (err) {
                reject(err);
            } else {
                let fileUrl = pathToUpload ? `${CONFIG.SERVER_URL}${pathOnServer}/${fileName}` : `${CONFIG.SERVER_URL}${CONFIG.PATH_TO_UPLOAD_SUBMISSIONS_ON_LOCAL}/${fileName}`;
                resolve(fileUrl);
            }
        });
    });
};

/**
 * function to upload a file on either local server or on s3 bucket.
 */
fileUploadService.uploadFile = async (payload, pathToUpload, pathOnServer) => {
    let fileNameArray = payload.file.originalname.split('.');
    let fileExtention = fileNameArray[fileNameArray.length - 1];

    let fileName = `${Date.now()}_${fileNameArray.filter(ele => ele != fileExtention).join('_')}.${fileExtention}`, fileUrl = '';
    if (payload.type == FILE_UPLOAD_TYPE.SYMBOLS) {
        fileName = `symbols/${fileName}`;
    }
    else if (payload.type == FILE_UPLOAD_TYPE.PROFILE) {
        fileName = `profiles/${fileName}`;
    }
    else if (payload.type == FILE_UPLOAD_TYPE.GAME_IMAGE) {
        fileName = `gameImage/${fileName}`;
    }
    else if (payload.type == FILE_UPLOAD_TYPE.STYLE_SHEET) {
        fileName = `styleSheet/${fileName}`;
    }
    else if (payload.type == FILE_UPLOAD_TYPE.ANIMATION) {
        fileName = `animation/${fileName}`;
    }
    else if (payload.type == FILE_UPLOAD_TYPE.THEME) {

        if(!['zip', 'ZIP'].includes(fileExtention)){
            throw createErrorResponse(MESSAGES.FILE_MUST_BE_OF_ZIP_TYPE, ERROR_TYPES.BAD_REQUEST);
        }

        fileName = Date.now().toString(36);
        await fileUploadService.extractZipFile(payload, fileName);
        return `theme/${fileName}`;
    }
    else if (payload.type == FILE_UPLOAD_TYPE.PRIZE_IMAGE) {
        fileName = `prizeImage/${fileName}`;
    }

    if (CONFIG.UPLOAD_TO_S3_BUCKET.toLowerCase() === 'true') {
        fileUrl = await fileUploadService.uploadFileToS3(payload, fileName, CONFIG.S3_BUCKET.bucketName);
    } else {
        fileUrl = await fileUploadService.uploadFileToLocal(payload, fileName, pathToUpload, pathOnServer);
    }
    return fileUrl;
};

/**
 * function to get a file from s3(AWS) bucket.
 */
fileUploadService.getS3File = async (payload, bucketName) => {
    return new Promise((resolve, reject) => {
        s3Bucket.getObject({ Bucket: bucketName || CONFIG.S3_BUCKET.bucketName, Key: payload.path }, function (err, data) {
            if (err) {
                if (err && err.code == "AccessDenied") {
                    resolve({ not_found: true });
                }
                else {
                    console.log("S3 file getting error", err);
                    reject(new Error("S3 file getting error"));
                }
            }
            else {
                resolve(data);
            }
        });
    });
};

module.exports = fileUploadService;