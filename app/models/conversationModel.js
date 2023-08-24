'use strict';

/************* Modules ***********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;
const { MESSAGE_TYPES, MESSAGE_STATUS } = require("../utils/constants");

/************* Conversation Model ***********/
const conversationSchema = new Schema({
    roomId: { type: Schema.Types.ObjectId, ref: 'conversationRooms' },
    message: { type: String },
    senderId: { type: Schema.Types.ObjectId, ref: 'users' },
    receivedBy: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    sentAt: { type: Date },
    messageStatus: { type: Number, enum: Object.values(MESSAGE_STATUS), default: MESSAGE_STATUS.SENT },
    fileName: { type: String },
    fileUrl: { type: String },
    fileType: { type: Number, enum: Object.values(MESSAGE_TYPES), default: MESSAGE_TYPES.TEXT },
    deletedBy: { type: [{ type: Schema.Types.ObjectId, ref: 'users' }], default: undefined},
}, { timestamps: true, versionKey: false, collection: 'conversation' });

module.exports = MONGOOSE.model('conversation', conversationSchema);