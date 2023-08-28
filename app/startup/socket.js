/** -- import all modules */
const CONFIG = require('../../config');
const { authService, userService } = require('../services');
const { MESSAGES, SOCKET_EVENTS, S3_DEFAULT_PROFILE_IMAGE } = require('../utils/constants');
const routeUtils = require('../utils/routeUtils');
const { convertIdToMongooseId } = require('../utils/utils');
const { conversationController, notificationController } = require('../controllers');

/** initialize **/
let socketConnection = {};

socketConnection.connect = async function (io) {
    io.use(authService.socketAuthentication);
    io.on('connection', async (socket) => {
        console.log('connection established', socket.id);
        
        socket.use(async (packet, next) => {
            console.log('Socket hit:=>', packet);
            /** validate here **/
            try {
                console.log('Socket hit :- ', packet[0]);
                await routeUtils.route(packet);
                next();
            } catch (error) {
                console.log(error.message);
                packet[2]({ success: false, message: error.message });
            }  
        });

        // await userService.findOneAndUpdate({ _id: convertIdToMongooseId(socket.id) }, { $set: { lastLoginDate: new Date(), isOnline: true }});

        socket.on(SOCKET_EVENTS.DISCONNECT, async () => {

            console.log('Disconnected socket id is ', socket.id);
            await userService.findOneAndUpdate({ _id: convertIdToMongooseId(socket.id) }, { $set: { lastLoginDate: new Date(), isOnline: false, lastloginSession: (Math.floor((Date.now() - new Date(socket.user.lastLoginDate).getTime())/1000))}});
        });

        socket.on(SOCKET_EVENTS.GET_ROOMS, async (payload, callback) => {
     
            payload = {};
            payload.userId = socket.id;

            let roomsData = await conversationController.getUserRooms(payload);
            console.log(roomsData);

            callback({ success: true, message: MESSAGES.ROOM_FETCHED_SUCCESSFULLY, data: roomsData });
        });

        socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (payload, callback) => {

            payload.userId = socket.id;

            let roomData = await conversationController.roomInformation(payload);
            console.log(roomData);
            if (!roomData){
                callback({ success: false, message: MESSAGES.CONVERSATION.NOT_FOUND });
            }

            let message = await conversationController.saveMessage(payload);
            payload.senderId = payload.userId;
            payload.newMessage = true;
            payload.fileType = message.fileType;
            payload.fileUrl = message.fileUrl;
            payload.userName = socket.user.firstName + " " +  socket.user.lastName;
            payload.profileImage = CONFIG.S3_BUCKET.cloudfrontUrl + '/' + (!socket.user.profileImage ? S3_DEFAULT_PROFILE_IMAGE : socket.user.profileImage);
            
            socket.to(payload.roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, payload);

            callback({ success: true, message: MESSAGES.MESSAGE_SENT, data: message });
        });

        socket.on(SOCKET_EVENTS.GET_MESSAGES, async (payload, callback) => {

            payload.userId = socket.id;

            let roomData = await conversationController.roomInformation(payload); 
            console.log(roomData,'roomdata');
            if (!roomData){
                callback({ success: false, message: MESSAGES.CONVERSATION.NOT_FOUND });
            }

            let response = await conversationController.getGroupConversation(payload);
            console.log(response.data[0]);

            callback({ success: true, message: response.msg, data: response.data });
        });
        
        socket.on(SOCKET_EVENTS.NOTIFICATION_LIST, async (payload, callback) => {
             payload = {};
            payload.userId = socket?.id|| 'Yl9IuUk6u2VDMD8hAAAH';

            let response = await notificationController.listNotification(payload);
            response.notificationList = true;
    
            callback({ success: true, message: MESSAGES.NOTIFICATION_SENT_SUCCESSFULLY, data: response });
        });

        socket.on(SOCKET_EVENTS.GET_NOTIFICATION, async (payload, callback) => {

            let response = await notificationController.listNotification({ userId: socket.id, skip: (payload.skip || 0), limit: (payload.limit || 10) });

            response.getNotification = true;
            delete response.notification;
    
            callback({ success: true, message: MESSAGES.NOTIFICATION_COUNT_FETCHED_SUCCESSFULLY, data: response });
        });

        socket.on(SOCKET_EVENTS.CLEAR_NOTIFICATIONS, async (payload, callback) => {

            payload.userId = socket.id;
            await notificationController.clearNotification(payload);

            callback({ success: true, message: MESSAGES.NOTIFICATIONS_CLEARED_SUCCESSFULLY, data: { clearNotification: true } });
        });

        socket.on(SOCKET_EVENTS.MESSAGE_SEEN, async (payload, callback) => {

            payload.userId = socket.id;
            await conversationController.messageUpdate(payload);

            callback({ success: true, message: MESSAGES.MESSAGE_READ });
        });

        socket.on(SOCKET_EVENTS.USER_UNREAD_COUNT, async (payload, callback) => {
            console.log(payload);
            payload = {};
            payload.userId = socket.id;

            let response = await conversationController.getUserUnreadCount(payload);
            console.log(response);
            response.userUnreadCount = true;
            callback({ success: true, message: MESSAGES.MESSAGE_READ, data: response.data });
        });

      
    });
};

module.exports = socketConnection;