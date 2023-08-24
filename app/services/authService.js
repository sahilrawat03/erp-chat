'use strict';

const { API_AUTH_KEY } = require('../../config');
const { decryptJwt } = require("../utils/utils");
const { createErrorResponse } = require("../helpers");
const userService = require('../services/userService');
const dbService = require('../services/dbService');
const ConversationRoomModel = require('../models/conversationRoomModel');
const userPermissionService = require('../services/userPermissionService');
const { MESSAGES, ERROR_TYPES, AVAILABLE_AUTHS, NORMAL_PROJECTION, USER_TYPE } = require('../utils/constants');
const axios = require('axios');


let authService = {};

authService.validateApiKey = () => {
    return (request, response, next) => {
        if (request.headers['x-api-key'] == API_AUTH_KEY) {
            return next();
        }
        let responseObject = createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED);
        return response.status(responseObject.statusCode).json(responseObject);
    };
};

/**
 * function to authenticate user.
 */
authService.userValidate = (authType) => {
    return (request, response, next) => {
        validateUser(request, authType).then((isAuthorized) => {
            if (typeof (isAuthorized) == 'string') {
                let responseObject = createErrorResponse(MESSAGES.FORBIDDEN(request.method, request.url), ERROR_TYPES.FORBIDDEN);
                return response.status(responseObject.statusCode).json(responseObject);
            }
            if (isAuthorized) {
                return next();
            }
            let responseObject = createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED);
            return response.status(responseObject.statusCode).json(responseObject);
        }).catch(() => {
            let responseObject = createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED);
            return response.status(responseObject.statusCode).json(responseObject);
        });
    };
};

/**
 * function to validate user's token and fetch its details from the system. 
 * @param {} request 
 */
let validateUser = async (request, authType) => {
    try {
        let session = await decryptJwt(request.headers.authorization);
        if (!session) {
            return false;
        }

        let user = await userService.findOne({ _id: session.userId }, { ...NORMAL_PROJECTION, password: 0 });
        await userService.findOneAndUpdate({ _id: session.userId }, { lastIPAddress: request.ip.split(':').slice(-1)[0] });
        if (!user) {
            return false;
        }

        if (authType == AVAILABLE_AUTHS.SUPER_ADMIN && user.userType != USER_TYPE.SUPER_ADMIN) {
            return false;
        } else if (authType == AVAILABLE_AUTHS.ADMIN && user.userType != USER_TYPE.ADMIN) {
            return false;
        } else if (authType == AVAILABLE_AUTHS.ADMIN_SUPER_ADMIN && !(user.userType == USER_TYPE.SUPER_ADMIN || user.userType == USER_TYPE.ADMIN)) {
            return false;
        }

        if (user) {
            request.session = {
                token: request.headers.authorization
            };
            request.user = user;
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
};

/**
 * function to check user permission.
 */
authService.checkPermission = (permission) => {
    return (request, response, next) => {
        validatePermission(request, permission).then((isAuthorized) => {
            if (typeof (isAuthorized) == 'string') {
                let responseObject = createErrorResponse(MESSAGES.FORBIDDEN(request.method, request.url), ERROR_TYPES.FORBIDDEN);
                return response.status(responseObject.statusCode).json(responseObject);
            }
            if (isAuthorized) {
                return next();
            }
            let responseObject = createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED);
            return response.status(responseObject.statusCode).json(responseObject);
        }).catch(() => {
            let responseObject = createErrorResponse(MESSAGES.UNAUTHORIZED, ERROR_TYPES.UNAUTHORIZED);
            return response.status(responseObject.statusCode).json(responseObject);
        });
    };
};

/**
 * function to validate user's permission. 
 * @param {} request 
 */
let validatePermission = async (request, permission) => {
    try {
        let user = request.user;

        if (user.userType === USER_TYPE.SUPER_ADMIN){
            return true;
        } else if (user.userType === USER_TYPE.ADMIN){
            let userPermission = (await userPermissionService.findOne({ userId: user._id }, NORMAL_PROJECTION)) || {};

            if (userPermission[permission]){
                return true;
            }
            return false;
        }
    } catch (err) {
        return false;
    }
};

/** -- function to authenticate socket token */
authService.socketAuthentication = async (socket, next) => {    
    try {
        console.log('---');
        // let data = axios.post(`http://localhost:4001/v1/auth/check_authenticated`, {}, { authorization: socket.handshake.query.authorization });
        // console.log(data);
//   .then(response => {
//     console.log('Response:');
//   })
//   .catch(error => {
//     console.error('Error:');
//   });
        let userData = await axios.post(`http://localhost:4001/v1/auth/check_authenticated`, { },
            { headers: {  authorization: socket.handshake.query.authorization   } }
        );
        userData = userData.data.data;
        // console.log(userData);
        let session = decryptJwt(socket.handshake.query.authorization);
        if (!session) {
            return next({ success: false, message: MESSAGES.UNAUTHORIZED });
        }
        // console.log(session, '88888888888888888888888888');
        // let user = await userService.findOne({ _id: session._id }, { userType: 1, email: 1, lastLoginDate:1, firstName: 1, lastName: 1, profileImage: 1, isResponsibleGamingOn: 1 });
        if (!userData) {
            return next({ success: false, message: MESSAGES.UNAUTHORIZED });
        }

        socket.id = userData._id.toString();
        socket.user = userData;
        
        let roomsData = await dbService.find(ConversationRoomModel, { 'members.userId': userData._id, isDeleted: { $ne: true } });
        
        for (let room of roomsData) {
            socket.join(room._id.toString());
        }
    
        return next();
    }
    catch (err) {
        return next({ success: false, message: MESSAGES.SOMETHING_WENT_WRONG });
    }
}; 

module.exports = authService;