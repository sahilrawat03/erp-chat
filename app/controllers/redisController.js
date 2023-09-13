'use strict';

const chatRoomController = require('./chatRoomController');
const notificationController = require('./notificationController');
const { REDIS_EVENTS, SOCKET_EVENTS } = require('../utils/constants');

/**************************************************
 ***************** Redis controller ****************
 **************************************************/

let redisService = { };


/**
 * Function to create room
 */
global.subClient.subscribe(REDIS_EVENTS.CHATROOM, async (payload) => {
    payload = JSON.parse(payload);

    await chatRoomController.createRoom(payload);
});

global.subClient.subscribe(REDIS_EVENTS.NOTIFICATION, async (payload) => {
    payload = JSON.parse(payload);

    await notificationController.saveNotification(payload);
    global.io.sockets.to(payload.userIds).emit(SOCKET_EVENTS.INTERVIEW_REMINDER, payload);
});

module.exports = redisService;