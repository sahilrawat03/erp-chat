const MICROSERVICE_CONFIG = {
	AUTHENTICATE_USER: {
		URL: process.env.AUTHENTICATION_MICROSERVICE_URL || 'http://0.0.0.0:4001',
        get GET_USER_AUTHENTICATE_API_URL() {
            return this.URL + '/v1/auth/check_authenticated';
        }
	},
	API_GATEWAY_URL: process.env.API_GATEWAY_URL || 'http://0.0.0.0:4000'
};

module.exports = MICROSERVICE_CONFIG;
