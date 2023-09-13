'use strict';

/************* Modules ***********/
const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;

/************* Notification Model ***********/
const notificationSchema = new Schema({
    notificationType: { type: String },
    message: { type: String },
    userIds: { type: [ { type: Schema.Types.ObjectId } ], default: [] },
    readBy: { type: [ { type: Schema.Types.ObjectId } ], default: [] }
}, { timestamps: true, versionKey: false, collection: 'notifications' });

module.exports = MONGOOSE.model('notification', notificationSchema);