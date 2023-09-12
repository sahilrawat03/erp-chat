/** -- import all modules */
const CONFIG = require('../../config');
const { authService  } = require('../services');
const { MESSAGES, SOCKET_EVENTS, S3_DEFAULT_PROFILE_IMAGE } = require('../utils/constants');
const routeUtils = require('../utils/routeUtils');
const { conversationController, notificationController } = require('../controllers');

/** initialize **/
let socketConnection = {};

socketConnection.connect = async function (io) {
    io.use(authService.socketAuthentication);
    io.on('connection', async (socket) => {
        console.log('connection established', socket.id);
        
        socket.use(async (packet, next) => {
            // console.log('Socket hit:=>', packet);
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


        socket.on(SOCKET_EVENTS.DISCONNECT, async () => {

            console.log('Disconnected socket id is ', socket.id);
        });

        socket.on(SOCKET_EVENTS.GET_ROOMS, async (payload, callback) => {
     
            payload = {};
            payload.userId = socket.id;

            let roomsData = await conversationController.getUserRooms(payload);

            callback({ success: true, message: MESSAGES.ROOM_FETCHED_SUCCESSFULLY, data: roomsData });
        });

        socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (payload, callback) => {

            payload.userId = socket.id;

            let roomData = await conversationController.roomInformation(payload);
            if (!roomData){
                callback({ success: false, message: MESSAGES.CONVERSATION.NOT_FOUND });
            }

            let message = await conversationController.saveMessage(payload);
            payload.senderId = payload.userId;
            payload.newMessage = true;
            payload.fileType = message.fileType;
            payload.fileUrl = message.fileUrl;
            payload.createdAt = new Date();
            payload.senderName = socket.user.name;
            payload.profileImage = CONFIG.S3_BUCKET.cloudfrontUrl + '/' + (!socket.user.profileImage ? S3_DEFAULT_PROFILE_IMAGE : socket.user.profileImage);
            socket.to(payload.roomId).emit(SOCKET_EVENTS.NEW_MESSAGE, payload);
            // io.emit(SOCKET_EVENTS.NEW_MESSAGE, payload);

            callback({ success: true, message: MESSAGES.MESSAGE_SENT, data: message });
        });

        socket.on(SOCKET_EVENTS.GET_MESSAGES, async (payload, callback) => {

            payload.userId = socket.id;

            let roomData = await conversationController.roomInformation(payload); 
            if (!roomData){
                callback({ success: false, message: MESSAGES.CONVERSATION.NOT_FOUND });
            }

            let response = await conversationController.getGroupConversation(payload);

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
            payload = {};
            payload.userId = socket.id;

            let response = await conversationController.getUserUnreadCount(payload);
            response.userUnreadCount = true;
            callback({ success: true, message: MESSAGES.MESSAGE_READ, data: response.data });
        });

      
    });
};

module.exports = socketConnection;