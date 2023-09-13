'use strict';

const { Joi } = require('../../utils/joiUtils');
const { chatRoomController } = require('../../controllers');
const { AVAILABLE_AUTHS } = require('../../utils/constants');

const routes = [
	{
		method: 'POST',
		path: '/v1/room',
		joiSchemaForSwagger: {
			headers: {
				authorization: Joi.string().required().description('authorization')
			},
			body: {
				roomId: Joi.string().objectId().required().description('Required'),
                members: Joi.array().items(Joi.string().objectId()).min(1).required().description('Members list')
			},
			group: 'CHAT',
			description: 'Api to create room',
			model: 'createChatRooms'
		},
		auth: AVAILABLE_AUTHS.USER,
		handler: chatRoomController.createRoom
	},
	{
		method: 'DELETE',
		path: '/v1/room/:roomId',
		joiSchemaForSwagger: {
			headers: {
				authorization: Joi.string().required().description('authorization')
			},
			params: {
				roomId: Joi.string().objectId().required().description('Required')
			},
			group: 'CHAT',
			description: 'Api to delete room',
			model: 'deleteChatRooms'
		},
		auth: AVAILABLE_AUTHS.USER,
		handler: chatRoomController.deleteRoom
	}
];

module.exports = routes;
