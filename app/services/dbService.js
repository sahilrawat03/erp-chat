'use strict';

let modelService = {};

/**
* function to create.
*/
modelService.create = async (model, payload) => {
    return await new model(payload).save();
};

/**
* function to insert.
*/
modelService.insertMany = async (model, payload) => {
    return await model.insertMany(payload);
};

/**
* function to find.
*/
modelService.find = async (model, criteria, projection = { }) => {
    return await model.find(criteria, projection).lean();
};

/**
* function to find one.
*/
modelService.findOne = async (model, criteria, projection = { }) => {
    return await model.findOne(criteria, projection).lean();
};

/**
* function to find one.
*/
modelService.findOneWithoutLean = async (model, criteria, projection = { lean: false }) => {
    return await model.findOne(criteria, projection);
};

/**
* function to find with pagination.
*/
modelService.findPagination = async (model, criteria, projection = { }, skip, limit, sort = {}) => {
    return await model.find(criteria, projection).skip(skip).sort(sort).limit(limit).lean();
};

/**
* function to find with pagination.
*/
modelService.findSort = async (model, criteria, projection = { }, sort = {}) => {
    return await model.find(criteria, projection).sort(sort).lean();
};

/**
* function to update one.
*/
modelService.findOneAndUpdate = async (model, criteria, dataToUpdate, projection = { }) => {
    return await model.findOneAndUpdate(criteria, dataToUpdate, projection).lean();
};

/**
* function to update.
*/
modelService.updateMany = async (model, criteria, dataToUpdate, projection = { }) => {
    return await model.updateMany(criteria, dataToUpdate, projection).lean();
};

/**
* function to delete one.
*/
modelService.deleteOne = async (model, criteria) => {
    return await model.deleteOne(criteria);
};

/**
* function to delete.
*/
modelService.deleteMany = async (model, criteria) => {
    return await model.deleteMany(model, criteria);
};

/**
* function to apply aggregate on.
*/
modelService.aggregate = async (model, query) => {
    return await model.aggregate(query);
};

module.exports = modelService;