'use strict';

const axios = require('axios');
const CONFIG = require('./../../config');
const { dbService } = require('../services');
const { createSuccessResponse } = require('../helpers');
const { convertIdToMongooseId } = require('../utils/utils');
const { AUTHENTICATE_USER } = require('../../config/microserviceConfig');
const { ConversationRoomModel, ConversationModel } = require('../models');
const { MESSAGES, PAGINATION, S3_DEFAULT_PROFILE_IMAGE, SORTING, MESSAGE_STATUS } = require('../utils/constants');

/**************************************************
***************** Conversation controller ***************
**************************************************/
let conversationController = {};

/**
 * Function to get room information.
 * @param {*} payload 
 * @returns 
 */
conversationController.roomInformation = async (payload) => {
    return await dbService.findOne(ConversationRoomModel, {
        _id: convertIdToMongooseId(payload.roomId)
    });
};

/**
 * Function to save messages.
 * @param {*} payload 
 * @returns 
 */
conversationController.saveMessage = async (payload) => {
    let userDatas = await axios.get(`${AUTHENTICATE_USER.API_GATEWAY_URL}/v1/dropdown/user`);

    let dataToSave = { senderId: payload.userId, readBy: [payload.userId], ...payload };
    let message = await dbService.create(ConversationModel, dataToSave);

    if (payload.fileUrl) {
        message.fileUrl = CONFIG.S3_BUCKET.cloudfrontUrl.concat(`/${payload.fileUrl}`);
    }

    // incrementing everyone's unread count
    await dbService.findOneAndUpdate(ConversationRoomModel, { _id: payload.roomId }, { $inc: { 'members.$[].unreadCount': 1 }, lastMessageId: payload.messageId });

    // setting senders unread count to zero   
    await dbService.findOneAndUpdate(ConversationRoomModel, { _id: payload.roomId, 'members.userId': { $in: [payload.userId] } }, { $set: { 'members.$.unreadCount': 0 } });
    message.senderName = (userDatas.data.data.find((i) => i._id == message.senderId.toString())).name;
    return message;
};

/**
 * Function to get group conversation.
 * @param {*} payload 
 * @returns 
 */
conversationController.getGroupConversation = async (payload) => {
    let userDatas = await axios.get(`${AUTHENTICATE_USER.API_GATEWAY_URL}/v1/dropdown/user`);
    let conversationAggregateQuery = [
        { $match: { roomId: convertIdToMongooseId(payload.roomId) } },
        { $sort: { createdAt: -1 } },
        { $skip: payload.skip ? payload.skip : PAGINATION.SKIP },
        { $limit: payload.limit ? payload.limit : PAGINATION.LIMIT },
        { $sort: { createdAt: 1 } },
        { $group:{
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, 
            messageData: { $push: {
                roomId: '$roomId', 
                message: '$message',
                fileName: '$fileName',
                fileType: '$fileType',
                fileUrl: { $concat: [ CONFIG.S3_BUCKET.cloudfrontUrl, '$fileUrl' ] },
                senderId: '$senderId',
                createdAt: '$createdAt',
                messageStatus: '$messageStatus',
            }}
        }},
        { $sort: { _id: payload.sortDirection ? payload.sortDirection : SORTING.ASCENDING } },
    ];

    // setting users unread count to zero
    await dbService.findOneAndUpdate(ConversationRoomModel, { _id: convertIdToMongooseId(payload.roomId), 'members.userId': { $in: [payload.userId] } }, { $set: { 'members.$.unreadCount': 0 } });

    // setting users message status to seen
    await dbService.updateMany(ConversationModel, { roomId: convertIdToMongooseId(payload.roomId), senderId: { $ne: convertIdToMongooseId(payload.userId) } }, { $addToSet: { receivedBy: convertIdToMongooseId(payload.userId) }, $set: { messageStatus: MESSAGE_STATUS.SEEN } });
    const conversationList = await dbService.aggregate(ConversationModel, conversationAggregateQuery);
    const userIdToNameMap = {};
    userDatas.data.data.forEach(user => {
      userIdToNameMap[user._id.toString()] = user.name;
    });
    for ( let index = 0; index < conversationList.length; index++){
        let messageData = conversationList[index].messageData;

        conversationList[index].messageData = messageData.map(member => ({
            ...member,
            senderName: userIdToNameMap[member.senderId],
        }));
    }
    return createSuccessResponse(MESSAGES.CONVERSATION.LIST_FETCHED, conversationList);
};

/**
 * Function to get user rooms.
 * @param {*} payload 
 * @returns 
 */
conversationController.getUserRooms = async (payload) => {

    let userDatas = await axios.get(`${API_GATEWAY_URL}/v1/dropdown/user`);

    let roomListAggregateQuery = [
        { $match: { 'members.userId': convertIdToMongooseId(payload.userId) }},
        { $addFields : { users: {
            $filter: {
                input: '$members',
                as: 'member',
                cond: { $ne: [ '$$member.userId', convertIdToMongooseId(payload.userId) ] }
            } }
        } },
        { $lookup: {
            from: 'conversation',
            let: { conversationRoomId: '$_id' },
            pipeline: [
                { $match: { $expr: { $eq: ['$roomId', '$$conversationRoomId'] } } },
                { $sort: { createdAt: -1 } },
                { $limit: 1 }
            ],  
            as: 'conversation'
        } },
        { $unwind: { path: '$conversation', preserveNullAndEmptyArrays: true } },
        { $addFields: { 'userUnreadCount': {
            $filter: {
                input: '$members',
                as: 'member',
                cond: { $eq: [ '$$member.userId', convertIdToMongooseId(payload.userId) ] }
            }}
        }},
        { $unwind: { path: '$userUnreadCount', preserveNullAndEmptyArrays: true } },
        { $project: {
            _id: 1,
            members: 1,
            profileImage: { $concat: [ CONFIG.S3_BUCKET.cloudfrontUrl, '/', { $ifNull: [ '$userData.profileImage', S3_DEFAULT_PROFILE_IMAGE ] } ] },
            unreadCount: '$userUnreadCount.unreadCount',
            lastMessage: { $cond: [ '$conversation.message', '$conversation.message', '$conversation.fileName']}
        } }
    ];
    let roomData = await dbService.aggregate(ConversationRoomModel, roomListAggregateQuery);

    const userIdToNameMap = {};
    userDatas.data.data.forEach(user => {
      userIdToNameMap[user._id.toString()] = user.name;
    });

    // Map the user names to the group members
    let groupWithMappedNames;
    for (let room of roomData) {
        
          groupWithMappedNames = {
          ...room,
          members: room.members.map(member => ({
            ...member,
            name: userIdToNameMap[member.userId.toString()]
          }))
        };
    }
    let roomIds = roomData.map(room => room._id);

    // setting users message status to delivered
    await dbService.updateMany(ConversationModel, { roomId: { $in: roomIds }, messageStatus: { $ne: MESSAGE_STATUS.SEEN } }, { $set: { messageStatus: MESSAGE_STATUS.DELIVERED } });

    return groupWithMappedNames;
};

conversationController.messageUpdate = async (payload) => {

    await dbService.updateMany(ConversationModel, { roomId: convertIdToMongooseId(payload.roomId), messageStatus: { $ne: MESSAGE_STATUS.SEEN } }, { $set: { messageStatus: MESSAGE_STATUS.SEEN } });
    await dbService.findOneAndUpdate(ConversationRoomModel, { _id: convertIdToMongooseId(payload.roomId), 'members.userId': { $in: [payload.userId] } }, { $set: { 'members.$.unreadCount': 0 } });

    return createSuccessResponse(MESSAGES.MESSAGE_READ);
};

conversationController.getUserUnreadCount = async (payload) => {

    let userUnreadCountAggregateQuery = [
        { $match: { 'members.userId': convertIdToMongooseId(payload.userId), _id: convertIdToMongooseId(payload.roomId) } },
        { $addFields: { 'userUnreadCount': {
            $filter: {
                input: '$members',
                as: 'member',
                cond: { $and: [{ $eq: [ '$$member.userId', convertIdToMongooseId(payload.userId) ]},{ $ne: [ '$$member.unreadCount', 0 ]}] }
            }}
        }},
        { $match: { $expr: { $gt: [ { $size: '$userUnreadCount' }, 0] } } },
        { $unwind: '$userUnreadCount' },
    ];

    let unreadCount = (await dbService.aggregate(ConversationRoomModel, userUnreadCountAggregateQuery))[0];
    return createSuccessResponse(MESSAGES.MESSAGE_READ, { totalUnreadCount: (!unreadCount ? 0 : unreadCount.userUnreadCount?.unreadCount) });
};

/* export controller */
module.exports = conversationController;