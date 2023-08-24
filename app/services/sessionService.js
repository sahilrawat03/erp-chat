'use strict';

const { SessionModel } = require('../models');

let sessionService = {};

/**
* function to create session.
*/
sessionService.create = async (payload) => {
    return await new SessionModel(payload).save();
};

/**
* function to insert sessions.
*/
sessionService.insertMany = async (payload) => {
    return await SessionModel.insertMany(payload);
};

/**
* function to find sessions.
*/
sessionService.find = async (criteria, projection = {}) => {
    return await SessionModel.find(criteria, projection).lean();
};

/**
* function to find one session.
*/
sessionService.findOne = async (criteria, projection = {}) => {
    return await SessionModel.findOne(criteria, projection).lean();
};

/**
* function to update one session.
*/
sessionService.findOneAndUpdate = async (criteria, dataToUpdate, projection = {}) => {
    return await SessionModel.findOneAndUpdate(criteria, dataToUpdate, projection).lean();
};

/**
* function to update sessions.
*/
sessionService.updateMany = async (criteria, dataToUpdate, projection = {}) => {
    return await SessionModel.updateMany(criteria, dataToUpdate, projection).lean();
};

/**
* function to delete one session.
*/
sessionService.deleteOne = async (criteria) => {
    return await SessionModel.deleteOne(criteria);
};

/**
* function to delete sessions.
*/
sessionService.deleteMany = async (criteria) => {
    return await SessionModel.deleteMany(criteria);
};

/**
* function to apply aggregate on sessionModel.
*/
sessionService.aggregate = async (query) => {
    return await SessionModel.aggregate(query);
};

module.exports = sessionService;