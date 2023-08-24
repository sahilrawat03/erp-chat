'use strict';

const { REDIS_EVENTS, USER_TYPE, SOCKET_EVENTS } = require('../utils/constants');
const notificationController = require('./notificationController');
const { userService } = require('../services');

/**************************************************
 ***************** Redis controller ****************
 **************************************************/

let redisService = { };

const redis = require('redis');

(async () => {

  const client = redis.createClient();

  const subscriber = client.duplicate();

  await subscriber.connect();

    await subscriber.subscribe('chatRoom', (message) => {
        message = JSON.parse(message);
        global.io.sockets.emit(SOCKET_EVENTS.CREATE_ROOM, payload);
    console.log(message); // 'message'
  });

})();

/**
 * Function to emit events to admins for notifications
 */
global.subClient.subscribe(REDIS_EVENTS.ADD_ROOM, async (payload) => {
    payload = JSON.parse(payload);
    
    global.io.sockets.emit(SOCKET_EVENTS.CREATE_ROOM, payload);
});

module.exports = redisService;