"use strict";

const { NotificationModel, UserWalletModel } = require('../models');
const { dbService } = require('../services');
const { convertIdToMongooseId } = require('./../utils/utils');

/**************************************************
***************** Notification Controller ***************
**************************************************/

let notificationController = {};

/**
 * Function to save notifications.
 * @param {*} payload 
 * @returns 
 */
notificationController.saveNotification = async (payload) => {
    payload.readBy = [];
    payload.readBy.push(payload.userId);
    let notification = await dbService.create(NotificationModel, payload);
    return notification;
};


/**
 * Function to list notifications.
 * @param {*} payload 
 * @returns 
 */
notificationController.listNotification = async (payload) => {

    let notificationAggregateQuery = [
        { $match: { readBy: { $nin: [convertIdToMongooseId(payload.userId)] } } },
        { $sort: { createdAt: -1 } },
        { $facet: {
            notificationData: [
                { '$skip': payload.skip },
                { '$limit': payload.limit }
            ],
            notificationCount: [{ '$count': 'total' }]
        }}
    ];

    let notification = (await dbService.aggregate(NotificationModel, notificationAggregateQuery))[0];
    let totalCount = notification.notificationCount.length ? notification.notificationCount[0].total : 0;
    
    return { notification: notification.notificationData, notificationCount: totalCount };
};

/**
 * Function to clear notifications.
 * @param {*} payload 
 * @returns 
 */
notificationController.clearNotification = async (payload) => {

    let criteria = { };

    if (payload.notificationId){
        criteria['_id'] = payload.notificationId;
    }

    await dbService.updateMany(NotificationModel, criteria, { $addToSet: { readBy: convertIdToMongooseId(payload.userId) } });
    return;
};

/* export notificationController */
module.exports = notificationController;