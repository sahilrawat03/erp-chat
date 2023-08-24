'use strict';

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.Promise = require('bluebird');

const { MONGODB } = require('../../config');
let URL = `mongodb://localhost:27017/erp-socket`;
module.exports = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    console.log(MONGODB.URL);
    await mongoose.connect(URL, options);
    console.log('MongoDB connected at', MONGODB.URL);
};