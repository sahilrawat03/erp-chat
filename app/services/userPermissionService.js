'use strict';

const { UserPermissionModel } = require('../models');

let userPermissionService = {};

/**
* function to create user.
*/
userPermissionService.create = async (payload) => {
    return await new UserPermissionModel(payload).save();
};

/**
* function to insert users.
*/
userPermissionService.insertMany = async (payload) => {
    return await UserPermissionModel.insertMany(payload);
};

/**
* function to find users.
*/
userPermissionService.find = async (criteria, projection = {}) => {
    return await UserPermissionModel.find(criteria, projection).lean();
};

/**
* function to find one user.
*/
userPermissionService.findOne = async (criteria, projection = {}) => {
    return await UserPermissionModel.findOne(criteria, projection).lean();
};

/**
* function to update one user.
*/
userPermissionService.findOneAndUpdate = async (criteria, dataToUpdate, projection = {}) => {
    return await UserPermissionModel.findOneAndUpdate(criteria, dataToUpdate, projection).lean();
};

/**
* function to update users.
*/
userPermissionService.updateMany = async (criteria, dataToUpdate, projection = {}) => {
    return await UserPermissionModel.updateMany(criteria, dataToUpdate, projection).lean();
};

/**
* function to delete one user.
*/
userPermissionService.deleteOne = async (criteria) => {
    return await UserPermissionModel.deleteOne(criteria);
};

/**
* function to delete users.
*/
userPermissionService.deleteMany = async (criteria) => {
    return await UserPermissionModel.deleteMany(criteria);
};

/**
* function to apply aggregate on UserPermissionModel.
*/
userPermissionService.aggregate = async (query) => {
    return await UserPermissionModel.aggregate(query);
};

module.exports = userPermissionService;