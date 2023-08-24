'use strict';

/************* Modules ***********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;

/************* Conversation Room Model ***********/
const conversationRoomSchema = new Schema({
    name: { type: String },
    interviewId:  { type: Schema.Types.ObjectId, ref: 'interviews' },
    lastMessageId: {type: Schema.Types.ObjectId, ref: 'conversation' },
    lastMessageSenderId: { type: Schema.Types.ObjectId, ref: 'users' },
    lastMessageTime: { type: Date },
    members: [{
        userId: { type: Schema.Types.ObjectId, ref: 'users' },
        unreadCount: { type: Number, default: 0 }
    }],
    status: { type: Number },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users' },
    expiryTime: { type: Date },
}, { timestamps: true, versionKey: false, collection: 'conversationRooms' });

module.exports = MONGOOSE.model('conversationRooms', conversationRoomSchema);