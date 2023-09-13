'use strict';

/********************************
 **** Managing all the models ***
 ********* independently ********
 ********************************/
module.exports = {
    NotificationModel: require('./notificationModel'),
    ConversationModel: require('./conversationModel'),
    ConversationRoomModel: require('./conversationRoomModel')
};