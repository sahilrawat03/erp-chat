'use strict';

const CONFIG = require('./../../config');
const { MESSAGES, PAGINATION, S3_DEFAULT_PROFILE_IMAGE, SORTING, MESSAGE_STATUS, ERROR_TYPES } = require('../utils/constants');
const { ConversationRoomModel, ConversationModel } = require('../models');
const {  dbService } = require('../services');
const { createSuccessResponse, createErrorResponse } = require('../helpers');
const { convertIdToMongooseId } = require('../utils/utils');

/**************************************************
***************** Conversation controller ***************
**************************************************/
let conversationController = {};

/**
 * Function to create room.
 * @param {*} payload 
 * @returns 
 */
conversationController.createRoom = async (payload) => {
    let dataToSave = {
        createdBy: payload.userId, updateBy: payload.userId,
        interviewId: payload.interviewId
    };
    if(payload.roomId){

        payload.members = payload.members.map((user) => {
            return { userId: user };
        });
        
        let roomData = await dbService.findOneAndUpdate(ConversationRoomModel, { _id: payload.roomId }, { $addToSet: { members: { $each: payload.members } } }, { new: true } );
        return createSuccessResponse(MESSAGES.SUCCESS, roomData);
    }

    payload.members.push(payload.userId);

    let room = await dbService.findOne(ConversationRoomModel, { members: { $size: payload.members.length }, interviewId:  payload.interviewId  });
    if (room) {
        return createSuccessResponse(MESSAGES.SUCCESS, room);
    }

    dataToSave['members'] = [];
    payload.members.forEach(userId => {
        dataToSave['members'].push({ userId });
    });

    let data = await dbService.create(ConversationRoomModel, dataToSave);
    return createSuccessResponse(MESSAGES.CONVERSATION.CREATED, data);
};

/**
 * Function to get room information.
 * @param {*} payload 
 * @returns 
 */
conversationController.roomInformation = async (payload) => {
    console.log(payload);
    return await dbService.findOne(ConversationRoomModel, {
        _id: convertIdToMongooseId(payload.roomId)
        // 'memebers.userId': { $in: [convertIdToMongooseId(payload.userId)] }
    });
};

/**
 * Function to save messages.
 * @param {*} payload 
 * @returns 
 */
conversationController.saveMessage = async (payload) => {

    let dataToSave = { senderId: payload.userId, readBy: [payload.userId], ...payload };
    let message = await dbService.create(ConversationModel, dataToSave);

    if (payload.fileUrl) {
        message.fileUrl = CONFIG.S3_BUCKET.cloudfrontUrl.concat(`/${payload.fileUrl}`);
    }

    // incrementing everyone's unread count
    await dbService.findOneAndUpdate(ConversationRoomModel, { _id: payload.roomId }, { $inc: { 'members.$[].unreadCount': 1 }, lastMessageId: payload.messageId });

    // setting senders unread count to zero   
    await dbService.findOneAndUpdate(ConversationRoomModel, { _id: payload.roomId, 'members.userId': { $in: [payload.userId] } }, { $set: { 'members.$.unreadCount': 0 } });
    return message;
};

/**
 * Function to get group conversation.
 * @param {*} payload 
 * @returns 
 */
conversationController.getGroupConversation = async (payload) => {

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
                fileUrl: { $concat: [ CONFIG.S3_BUCKET.cloudfrontUrl, '/', '$fileUrl' ] },
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

    return createSuccessResponse(MESSAGES.CONVERSATION.LIST_FETCHED, conversationList);
};

/**
 * Function to get user rooms.
 * @param {*} payload 
 * @returns 
 */
conversationController.getUserRooms = async (payload) => {

    let newMatchQuery = {};

    if (payload.searchKey) {
        newMatchQuery['$or'] = [
            { 'userData.firstName': { $regex: payload.searchKey, $options: 'i' } },
            { 'userData.lastName': { $regex: payload.searchKey, $options: 'i' } }
        ];
    }

    let roomListAggregateQuery = [
        { $match: { 'members.userId': convertIdToMongooseId(payload.userId) }},
        { $addFields : { users: {
            $filter: {
                input: '$members',
                as: 'member',
                cond: { $ne: [ '$$member.userId', convertIdToMongooseId(payload.userId) ] }
            }}
        }},
        { $lookup: {
            from: 'conversation',
            let: { conversationRoomId: '$_id' },
            pipeline: [
                { $match: { $expr: { $eq: ['$roomId', '$$conversationRoomId'] } } },
                { $sort: { createdAt: -1 } },
                { $limit: 1 }
            ],  
            as: 'conversation'
        }},
        { $unwind: { path: '$conversation', preserveNullAndEmptyArrays: true } },
        { $lookup: {
            from: 'users',
            localField: 'users.userId',
            foreignField: '_id',  
            as: 'userData'
        }},
        { $unwind: { path: '$userData', preserveNullAndEmptyArrays: true } },
        { $match : newMatchQuery },
        { $sort: { 'conversation.createdAt': -1 } },
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
            name: { $concat: [ '$userData.firstName', ' ', '$userData.lastName' ] },
            isOnline: '$userData.isOnline',
            userId: '$userData._id',
            profileImage: { $concat: [ CONFIG.S3_BUCKET.cloudfrontUrl, '/', { $ifNull: [ '$userData.profileImage', S3_DEFAULT_PROFILE_IMAGE ] } ] },
            lastLoginDate: '$userData.lastLoginDate',
            unreadCount: '$userUnreadCount.unreadCount',
            lastMessage: { $cond: [ '$conversation.message', '$conversation.message', '$conversation.fileName']}
        }}
    ];
    let roomData = await dbService.aggregate(ConversationRoomModel, roomListAggregateQuery);

    let roomIds = roomData.map(room => room._id);

    // setting users message status to delivered
    await dbService.updateMany(ConversationModel, { roomId: { $in: roomIds }, messageStatus: { $ne: MESSAGE_STATUS.SEEN } }, { $set: { messageStatus: MESSAGE_STATUS.DELIVERED } });

    return roomData;
};

conversationController.messageUpdate = async (payload) => {

    await dbService.updateMany(ConversationModel, { roomId: convertIdToMongooseId(payload.roomId), messageStatus: { $ne: MESSAGE_STATUS.SEEN } }, { $set: { messageStatus: MESSAGE_STATUS.SEEN } });
    await dbService.findOneAndUpdate(ConversationRoomModel, { _id: convertIdToMongooseId(payload.roomId), 'members.userId': { $in: [payload.userId] } }, { $set: { 'members.$.unreadCount': 0 } });

    return createSuccessResponse(MESSAGES.MESSAGE_READ);
};

conversationController.getUserUnreadCount = async (payload) => {

    let userUnreadCountAggregateQuery = [
        { $match: { 'members.userId': convertIdToMongooseId(payload.userId) } },
        { $addFields: { 'userUnreadCount': {
            $filter: {
                input: '$members',
                as: 'member',
                cond: { $and: [{ $eq: [ '$$member.userId', convertIdToMongooseId(payload.userId) ]},{ $ne: [ '$$member.unreadCount', 0 ]}] }
            }}
        }},
        { $match: { $expr: { $gt: [{ $size: '$userUnreadCount' }, 0] } }},
        { $group: {
            _id: null,
            totalRooms: { $push: '$_id' }
        }},
        { $project: {
            _id: 0,
            unreadRoomCount: { $size: '$totalRooms' }
        }}
    ];

    let unreadCount = (await dbService.aggregate(ConversationRoomModel, userUnreadCountAggregateQuery))[0];
    return createSuccessResponse(MESSAGES.MESSAGE_READ, { totalUnreadCount: (!unreadCount ? 0 : unreadCount.unreadRoomCount) });
};

/* export controller */
module.exports = conversationController;