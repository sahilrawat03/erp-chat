"use strict";

const cors = require('cors');
const helmet = require('helmet');
const routeUtils = require('../utils/routeUtils');
const routes = require('../routes/api/roomRoute');
const { log } = require('../utils/utils');

module.exports = async function (app) {
    app.use(cors());
    app.use(helmet());
    app.use(require("body-parser").json({ limit: '50mb' }));
    app.use(require("body-parser").urlencoded({ limit: '50mb', extended: true }));

    app.use((request, response, next) => {
		const start = process.hrtime.bigint();

		response.on('finish', () => {
			const end = process.hrtime.bigint();
			const seconds = Number(end - start) / 1000000000;
			const message = `${request.method} ${response.statusCode} ${request.url} took ${seconds} seconds`;

			if (response.statusCode >= 200 && response.statusCode <= 299) {
				log.success(message);
			} else if (response.statusCode >= 400) {
				log.error(message);
			} else {
				log.info(message);
			}
		});
		next();
	});

    /********************************
    ***** For handling CORS Error ***
    *********************************/
    app.all('/*', (request, response, next) => {
        response.header('Access-Control-Allow-Origin', '*');
        response.header('Access-Control-Allow-Headers', 'Content-Type, api_key, Authorization, x-requested-with, Total-Count, Total-Pages, Error-Message');
        response.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, OPTIONS');
        response.header('Access-Control-Max-Age', 1800);
        next();
    });

    await routeUtils.apiRoute(app, routes);
};
