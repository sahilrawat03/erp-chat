'use strict';

const { createSuccessResponse, createErrorResponse } = require("../helpers");
const { ConversationRoomModel } = require("../models");
const { dbService } = require("../services");
const { MESSAGES, ERROR_TYPES } = require("../utils/constants");

/**************************************************
 ***************** Redis controller ****************
 **************************************************/

let chatRoomController = { };


/**
 * Function to create room
 */
chatRoomController.createRoom = async (payload) => {

    let dataToSave = { createdBy: payload.user._id, updateBy: payload.user._id, _id: payload.roomId };

    let roomData = await dbService.findOne(ConversationRoomModel, { _id: payload.roomId, isDeleted: { $ne: true } });
    if (roomData) {
        let members = [];
        payload.members.forEach(userId => {
            let data = { userId, unreadCount: 0 };
            let isUserExists = roomData?.members.find(member => member?.userId?.toString() === userId?.toString());
            if (isUserExists) {
                data.unreadCount = isUserExists?.unreadCount;
            }
            members.push(data);
        });
    }

    dataToSave['members'] = [];
    payload.members.forEach(userId => {
        dataToSave['members'].push({ userId });
    });

    let data = await dbService.findOneAndUpdate(ConversationRoomModel, { _id: payload.roomId }, { $set: dataToSave }, { upsert: true });

    return createSuccessResponse(MESSAGES.CONVERSATION.CREATED, data);
};

/**
 * Function to delete rooms
 * @param {*} payload 
 * @returns 
 */
chatRoomController.deleteRoom = async (payload) => {

    let roomData = await dbService.findOne(ConversationRoomModel, { _id: payload.roomId });
    if (!roomData) {
       throw createErrorResponse(MESSAGES.NO_ROOM_FOUND, ERROR_TYPES.DATA_NOT_FOUND);
    }

    await dbService.findOneAndUpdate(ConversationRoomModel, { _id: payload.roomId }, { $set: { isDeleted: true } });

    return createSuccessResponse(MESSAGES.ROOM_DELETED_SUCCESSFULLY);
};

module.exports = chatRoomController;