'use strict';

const { REDIS_EVENTS, USER_TYPE, SOCKET_EVENTS } = require('../utils/constants');
const notificationController = require('./notificationController');
const { userService } = require('../services');
const conversationController = require('./conversationController');

/**************************************************
 ***************** Redis controller ****************
 **************************************************/

let redisService = { };


/**
 * Function to emit events to admins for notifications
 */
global.subClient.subscribe(REDIS_EVENTS.NOTIFICATION, async (payload) => {
    payload = JSON.parse(payload);

    let notification = await notificationController.saveNotification(payload);
    let notifications = await notificationController.listNotification({ userId: payload.userId, skip: 0, limit: 10 });
    
    let adminIds = (await userService.find({ userType: { $in: [ USER_TYPE.ADMIN, USER_TYPE.SUPER_ADMIN ] } }, { _id: 1 })).map( obj => obj._id.toString() );
    
    payload.notification = true;
    payload.notificationCount = notifications.notificationCount;
    payload._id = notification._id;
    payload.createdAt = notification.createdAt;
    payload.updatedAt = notification.updatedAt;
    
    global.io.sockets.to(adminIds).emit(SOCKET_EVENTS.NOTIFICATION, payload);
});
console.log(global);
global.subClient.subscribe(REDIS_EVENTS.ADD_ROOM, async (payload) => {
    console.log('----------controller reddis',payload);
    payload = JSON.parse(payload);
    // payload.userId = socket.id;

    let response = await conversationController.createRoom(payload);

    console.log('------------',payload,'redis');
    
    global.io.sockets.emit(SOCKET_EVENTS.CREATE_ROOM, payload);
});

module.exports = redisService;