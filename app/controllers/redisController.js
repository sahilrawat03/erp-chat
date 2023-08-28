'use strict';

const { REDIS_EVENTS } = require('../utils/constants');
const conversationController = require('./conversationController');

/**************************************************
 ***************** Redis controller ****************
 **************************************************/

let redisService = { };


/**
 * Function to create room
 */
global.subClient.subscribe(REDIS_EVENTS.ADD_ROOM, async (payload) => {
    payload = JSON.parse(payload);
    // payload.userId = socket.id;

    await conversationController.createRoom(payload);
});

module.exports = redisService;