
/********************************
 **** Managing all the services ***
 ********* independently ********
 ********************************/
 module.exports = {
    userService: require('./userService'),
    socketService: require('./socketService'),
    swaggerService: require('./swaggerService'),
    authService: require('./authService'),
    sessionService: require('./sessionService'),
     dbService: require('./dbService'),
};