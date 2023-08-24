'use strict';

const  { createClient } = require('redis');
const { REDIS } = require('../../config');
let { createAdapter } = require("@socket.io/redis-adapter");

const redisCred = {
    host: REDIS.HOST,
    port: REDIS.PORT
};

if ( REDIS.PASSWORD ){
    redisCred.password = REDIS.PASSWORD;
}

global.pubClient = createClient();
global.subClient = pubClient.duplicate();

module.exports = async () => {

    await pubClient.connect();
    await subClient.connect();

    await global.io.adapter(createAdapter(pubClient, subClient));
};