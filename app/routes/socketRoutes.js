'use strict';
const { Joi } = require('../utils/joiUtils');
const { SOCKET_EVENTS, MESSAGE_TYPES } = require('../utils/constants');

let routes = [
    // {
    //    action: 'emit',
    //    eventName: 'test',
    //     joiSchemaForSocket: {
    //         data: Joi.string().required(),
    //     },
    //    group: 'message',
    //    description: 'socket event for send message'
    // }, 
    {
        action: 'emit',
        eventName: SOCKET_EVENTS.READ_MESSAGE,
        joiSchemaForSocket: {
            conversationId: Joi.string().objectId().required(),
            date: Joi.date().iso().required()    
        },
        group: 'message',
        description: 'socket event to read message'
    }, 
    {
        action:'on',
        eventName: SOCKET_EVENTS.CREATE_ROOM,
        joiSchemaForSocket: {
            roomId: Joi.string().objectId().optional(),
            interviewId: Joi.string().objectId().required(),
            members: Joi.array().items(Joi.string().objectId()).min(1).required() 
        },
        group: 'message',
        description: 'socket event to create room.'
    }, 
    {
        action: 'on',
        eventName: SOCKET_EVENTS.GET_ROOMS,
        joiSchemaForSocket: {
            searchKey: Joi.string().trim().optional().description('Search Key'),
        },
        group: 'message',
        description: 'socket event to get room.'
    }, 
    {
        action: 'on',
        eventName: SOCKET_EVENTS.SEND_MESSAGE,
        joiSchemaForSocket: {
            roomId: Joi.string().objectId().required(),
            message: Joi.string().allow('').optional(),
            fileName: Joi.string().optional(),
            fileUrl: Joi.string().optional(),
            fileType: Joi.number().valid(...Object.values(MESSAGE_TYPES)).optional(),
        },
        group: 'message',
        description: 'socket event to send message.'
    }, 
    {
        action: 'on',
        eventName: SOCKET_EVENTS.NOTIFICATION_LIST,
        joiSchemaForSocket: {
            skip: Joi.number().default(0).optional(),
            limit: Joi.number().default(10).optional()
        },
        group: 'message',
        description: 'socket event to list notifications.'
    }, 
    {
        action: 'on',
        eventName: SOCKET_EVENTS.GET_MESSAGES,
        joiSchemaForSocket: {
            skip: Joi.number().default(0).optional(),
            limit: Joi.number().default(10).optional(),
            roomId: Joi.string().objectId().required(),
            sortDirection: Joi.number().valid(1, -1).default(-1).optional().description('Sort Key')
        },
        group: 'message',
        description: 'socket event to fetch messages.'
    }, 
    {
        action: 'on',
        eventName: SOCKET_EVENTS.CLEAR_NOTIFICATIONS,
        joiSchemaForSocket: {
            notificationId: Joi.string().objectId().optional(),
        },
        group: 'message',
        description:'socket event to clear notifications.'
    },
    {
        action: 'on',
        eventName: SOCKET_EVENTS.GET_NOTIFICATION,
        joiSchemaForSocket: {
            skip: Joi.number().default(0).optional(),
            limit: Joi.number().default(10).optional(),
        },
        group: 'message',
        description: 'socket event to clear notifications.'
    },
    {
        action: 'on',
        eventName: SOCKET_EVENTS.USER_UNREAD_COUNT,
        joiSchemaForSocket: {
            skip: Joi.number().default(1).optional(),
        },
        group: 'message',
        description: 'socket event to get Room\'s unread Count.'
    }
    // {
    //     action: 'on',
        // eventName: SOCKET_EVENTS.APPLY_ROULETTE_BET,
    //     joiSchemaForSocket: {
    //         table: Joi.number().default(0).optional(),
    //         limit: Joi.number().default(10).optional(),
    //     },
    //     group: 'message',
    //     description: 'socket event to clear notifications.'
    // }
];

module.exports = routes;