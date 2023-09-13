'use strict';

const axios = require('axios');
const MICROSERVICE_CONFIG = require('../../config/microserviceConfig');
const { decryptJwt } = require("../utils/utils");
const dbService = require('../services/dbService');
const { createErrorResponse } = require("../helpers");
const { MESSAGES, ERROR_TYPES } = require('../utils/constants');
const ConversationRoomModel = require('../models/conversationRoomModel');
const { AUTHENTICATE_USER } = require('../../config/microserviceConfig');


let authService = {};

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

let getUser = async (token) => {
    let axios = require('axios');
    let url = MICROSERVICE_CONFIG.AUTHENTICATE_USER.GET_USER_AUTHENTICATE_API_URL;
    return await axios.post(url, {}, { headers: { Authorization: token } });
  };
  
  /**
   * function to validate user's jwt token and fetch its details from the system. 
   * @param {} request 
   */
  let validateUser = async (request) => {
    try {
        let authenticatedUser = (await getUser(request.headers.authorization)).data.data;
        if (authenticatedUser) {
            authenticatedUser.accessToken = request.headers.authorization;
            request.user = authenticatedUser;
            return true;
        }
        return false;
    } catch (err) {
        if (err.code == 'ECONNREFUSED') {
            return err.code;
        }
        return false;
    }
  };

/** -- function to authenticate socket token */
authService.socketAuthentication = async (socket, next) => {    
    try {
        let userData = await axios.post(`${AUTHENTICATE_USER.API_GATEWAY_URL}/v1/auth/check_authenticated`, { },
            { headers: {  authorization: socket.handshake.query.authorization   } }
        );
        userData = userData.data.data;
        let session = decryptJwt(socket.handshake.query.authorization);
        if (!session) {
            return next({ success: false, message: MESSAGES.UNAUTHORIZED });
        }
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