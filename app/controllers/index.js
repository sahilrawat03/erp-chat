'use strict';

/********************************
 * Managing all the controllers *
 ********* independently ********
 ********************************/

module.exports = {
    redisController: require('./redisController'),
    chatRoomController: require('./chatRoomController'),
    conversationController: require('./conversationController'),
    notificationController: require('./notificationController'),
};