'use strict';

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.Promise = require('bluebird');

const { MONGODB } = require('../../config');

module.exports = async () => {
    console.log(MONGODB.URL);
    await mongoose.connect(MONGODB.URL, { useNewUrlParser: true, useUnifiedTopology: true });
};