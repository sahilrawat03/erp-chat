'use strict';

const CONFIG = require('../../config');

let CONSTANTS = {};

CONSTANTS.S3_DEFAULT_IMAGE = 'profiles/profile.jpg';

CONSTANTS.SERVER = {
    ONE: 1
};

CONSTANTS.SERVER_TYPES = {
    API: 'api',
    SOCKET: 'socket'
};

CONSTANTS.AVAILABLE_AUTHS = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    USER: 'user',
    ADMIN_SUPER_ADMIN: 'admin_super_admin',
    ALL: 'all'
};

CONSTANTS.TOKEN_TYPES = {
    LOGIN: 1,
    OTP: 2
};

CONSTANTS.BOOLEAN_VALUES = {
    TRUE: true,
    FALSE: false
};

CONSTANTS.DATABASE_VERSIONS = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
};

CONSTANTS.USER_TYPE = {
    USER: 1,
    SUPER_ADMIN: 2,
    ADMIN: 3
};

CONSTANTS.USER_CATEGORY = {
    NORMAL: 1,
    VIP: 2,
    VVIP: 3
};

CONSTANTS.PASSWORD_PATTERN_REGEX = /^(?=.{6,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/;
CONSTANTS.NAME_REGEX=/^[a-zA-Z\s]{1,20}[a-zA-Z\s]$/;
CONSTANTS.PHONE_REGEX=/^\+\d{1,3}\d{8,10}$/;

CONSTANTS.NORMAL_PROJECTION = { __v: 0, isDeleted: 0, createdAt: 0, updatedAt: 0 };
CONSTANTS.USER_PROJECTION = { createdBy: 0, updatedBy: 0 };

CONSTANTS.MESSAGES = require('./messages');

CONSTANTS.SECURITY = {
    JWT_SIGN_KEY: 'fasdkfjklandfkdsfjladsfodfafjalfadsfkads',
    BCRYPT_SALT: 8,
    STATIC_TOKEN_FOR_AUTHORIZATION: '58dde3df315587b279edc3f5eeb98145'
};

CONSTANTS.ERROR_TYPES = {
    DATA_NOT_FOUND: 'DATA_NOT_FOUND',
    BAD_REQUEST: 'BAD_REQUEST',
    MONGO_EXCEPTION: 'MONGO_EXCEPTION',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    FORBIDDEN: 'FORBIDDEN',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
};

CONSTANTS.LOGIN_TYPES = {
    NORMAL: 1,
    GOOGLE: 2,
    FACEBOOK: 3
};

CONSTANTS.EMAIL_TYPES = {
    WELCOME_EMAIL: 1,
    ICALENDER_EMAIL: 2,
    VERIFICATION_EMAIL: 3,
    FORGOT_PASSWORD_EMAIL: 4,
    SEND_INVITE_EMAIL: 5
};

CONSTANTS.EMAIL_SUBJECTS = {
    WELCOME_EMAIL: 'Test email',
    ICALENDER_EMAIL: "Event calender",
    VERIFICATION_EMAIL: "Verification email",
    FORGOT_PASSWORD_EMAIL: 'Forgot password email',
    SEND_INVITE_EMAIL: 'Invite code'
};

CONSTANTS.EMAIL_CONTENTS = {
    WELCOME_EMAIL: `<p>Hello<span style="color: #3366ff;"></span>,</p><p>This is test Email.</p><p>Regards,<br>Team Luxe Lotteries</p>`,
    ICALENDER_EMAIL: "",
    VERIFICATION_EMAIL: "",
    FORGOT_PASSWORD_EMAIL: "",
    SEND_INVITE_EMAIL: "",
};

CONSTANTS.AVAILABLE_EXTENSIONS_FOR_FILE_UPLOADS = ['csv', 'png'];

CONSTANTS.USER_MINIMUM_AGE = 18;
CONSTANTS.DEFAULT_PASSWORD = CONFIG.USER_DEFAULT_PASSWORD;

CONSTANTS.GENDER = {
    MALE: "Male",
    FEMALE: "Female",
    OTHERS: "Other"
};

CONSTANTS.OTP_EXPIRIED_TIME_IN_SECONDS = 300;

CONSTANTS.USER_STATUS = {
    DELETED: 1,
};

CONSTANTS.OTP_LENGTH = 6;

CONSTANTS.DEFAULT_IMAGE_URL = CONFIG.SERVER_URL + "/v1/file/profile.png";

CONSTANTS.S3_DEFAULT_PROFILE_IMAGE = 'profiles/profile.jpg';

CONSTANTS.S3_DEFAULT_GAME_IMAGE = 'gameImage/game.jpg';

CONSTANTS.REDIS_EXPIRE_TIME_IN_SEC = 10800;

CONSTANTS.SUB_ADMIN_PERMISSIONS = {
    CAN_ADD_GAME: 'canAddGame',
    CAN_EDIT_DELETE_GAME: 'canEditDeleteGame',
    CAN_ADD_USER: 'canAddUser',
    CAN_CHANGE_STATUS: 'canChangeStatus',
    CAN_CREATE_TOURNAMENT: 'canCreateTournament',
    CAN_ACCESS_TRANSCATION: 'canAccessTransactions',
    CAN_UPDATE_LANGUAGE: 'canUpdateLanguage'
};

CONSTANTS.FILE_UPLOAD_TYPE = {
    SYMBOLS: 1,
    PROFILE: 2,
    ANIMATION: 3
};

CONSTANTS.DURATION = {
    DAILY: 1,
    WEEKLY: 7,
    MONTHLY: 30
};

CONSTANTS.SOCKET_EVENTS = {
    TEST: 'test',
    GAME_DATA: 'gameData',
    USER_STATUS: 'userStatus',
    USER_UPDATED: 'userUpdate',
    DISCONNECT: 'disconnect',
    CREATE_ROOM: 'createRoom',
    SEND_MESSAGE: 'sendMessage',
    NEW_MESSAGE: 'newMessage',



    // Notification events
    NOTIFICATION: 'notification',
    GET_NOTIFICATION: 'getNotification',
    NOTIFICATION_LIST: 'notificationList',
    CLEAR_NOTIFICATIONS: 'clearNotifications',
    GET_MESSAGES: 'getMessages',
    MESSAGE_LIST: 'messageList',
    GET_ROOMS: 'getRooms',
    MESSAGE_SEEN: 'messageSeen',
    USER_UNREAD_COUNT: 'userUnreadCount',
    READ_MESSAGE: 'readMessage'
};

CONSTANTS.REDIS_EVENTS = {
    ADD_ROOM: 'chatRoom',
};



CONSTANTS.MESSAGE_TYPES = {
    TEXT: 1,
    IMAGE: 2,
    DOCUMENT: 3
};




CONSTANTS.GAME_CURRENT_ROUND = {
    IN_PROGRESS: 1,
    COMPLETED: 2,
};

CONSTANTS.TOURNAMENT_STATUS = {
	NOT_STARTED: 0,
	ACTIVE: 1,
	OVER: 2,
};

CONSTANTS.CURRENT_ROUND = {
    IN_PROGRESS: 1,
    COMPLETED: 2
};


CONSTANTS.CURRENT_ROUND_STATUS = {
    IN_PROGRESS: 1,
    COMPLETED: 2
};

CONSTANTS.PAYMENT_STATUS = {
	PROCESSING: 1,
	SUCCESS: 2,
	FAILED: 3,
};



CONSTANTS.PAGINATION = {
    SKIP: 0,
    LIMIT: 20
};

CONSTANTS.SORTING = {
    ASCENDING: -1,
    DESCENDING: 1
};

CONSTANTS.MESSAGE_STATUS = {
    SENT: 1,
    DELIVERED: 2,
    SEEN: 3
};

CONSTANTS.ENTRY_TYPE = {
    DAY_OF_DRAW: 1,
    DAY_BEFORE_DRAW: 2
};

CONSTANTS.FREQUENCY_TYPE = {
    ONCE: 1,
    MONTHLY: 2,
    QUATERLY: 3,
    YEARLY: 4
};

CONSTANTS.RUN_PROCESS_TYPE = {
    AUTO: 1,
    MANUAL: 2
};



CONSTANTS.MESSAGE_STATUS = {
    SENT: 1,
    DELIVERED: 2,
    SEEN: 3
};

CONSTANTS.PAGINATION = {
    SKIP: 0,
    LIMIT: 20
};

CONSTANTS.SUBSCRIPTION_FREQUENCY = {
    MONTHLY: 1,
    QUATERLY: 2
};








module.exports = CONSTANTS;