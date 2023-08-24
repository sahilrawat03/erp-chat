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
    WALLET_BALANCE: 'walletBalance',

    // Game events
    GAME_CLOSED: 'gameClosedPoker',
    PLAYERS_CONNECTED: 'playersConnectedPoker',
    USER_CARDS: 'userCardsPoker',
    DISRIBUTE_CARDS:'distributeCardsPoker',
    PLAYER_LEFT: 'playerLeftPoker',
    PLAYED_TURN: 'playedTurnPoker',
    PLAYER_TURN: 'playerTurnPoker',
    KICKOUT: 'kickoutPoker',
    CURRENT_ROUND: 'currentRoundPoker',
    GAME_WINNERS: 'gameWinnersPoker',
    LEAVE_MATCH: 'leaveMatchPoker',
    SOCKET_ERROR: 'SockerErrorPoker',
    START_MATCH_MAKING: 'startMatchMakingPoker',
    LOOSE_GAME: 'looseGamePoker',
    PLAY_TURN: 'playTurnPoker',
    RECONNECT_GAME: 'reconnectGamePoker',
    SITTING_ARRANGEMENT:'sittingArrangementPoker',
    TOURNAMENT_COMPLETED:'tournamentCompletedPoker',
    IS_NEXT_ROUND_POSSIBLE: 'isNextRoundPossiblePoker',
    GAME_COMPLETED: 'gameCompletedPoker',
    GAME_JOINED: 'gameJoinedPoker',
    RECONNETED: 'reconnected',
    TRADE_IN: 'tradeInPoker',
    TRADE_IN_USER_CARDS: 'tradeInUserCardsPoker',
    
    START_MATCH_MAKING_ROULETTE: 'startMatchMakingRoulette',
    LOOSE_GAME_ROULETTE: 'looseGameRoulette',
    LEAVE_MATCH_ROULETTE: 'leaveMatchRoulette',
    APPLY_ROULETTE_BET: 'applyRouletteBet',
    RECONNECT_GAME_ROULETTE: 'reconnectGameRoulette',
    SITTING_ARRANGEMENT_ROULETTE:'sittingArrangementRoulette',
    TOURNAMENT_COMPLETED_ROULETTE:'tournamentCompletedRoulette',
    GAME_JOINED_ROULETTE: 'gameJoinedRoulette',
    GAME_CLOSED_ROULETTE: 'gameClosedRoulette',
    PLAYER_KNOCK_OUT_ROULETTE: 'playerKnockOutRoulette',
    ROULETTE_PLAYERS_RESULT: 'playersRouletteResult',
    ROULETTE_NEW_GAME_START_TIME: 'rouletteNewGameStartTime',
    ROULETTE_RESULT: 'rouletteResult',
    PLAYERS_CONNECTED_ROULETTE: 'playersConnectedRoulette',
    APPLY_BETS_ROULETTE: 'applyBetsForRoulette',
    APPLIED_ROULETTE_BET: 'appliedRouletteBet',
    ROULETTE_TABLE_WINNER_SYMBOLS: 'rouletteWinnerSymbols',

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

CONSTANTS.VENDOR_CONTRACT_TYPE = {
    FIXED: 1,
    VARIABLE: 2
};

CONSTANTS.MESSAGE_TYPES = {
    TEXT: 1,
    IMAGE: 2,
    DOCUMENT: 3
};

CONSTANTS.MATCH_MAKING_TIMER = 30000;

CONSTANTS.GAME_STATUS = {
	MATCH_MAKING_STARTED: 1,
	ON_GOING: 2,
	FINISHED: 3
};

CONSTANTS.GAME = {
	SETTING: {
		NAME_PREFIX: 'LUXE_',
		MIN_PLAYERS: 2,
		MAX_PLAYERS: 9,
		DETAILS: {
		name: 'Luxe Poker',
		},
	},
	TABLE_LIMIT: {
		NO_LIMIT: 'no_limit',
		LIMIT: 'limit',
		POT_LIMIT: 'pot_limit',
	},
	TABLE_TYPE: {
		NORMAL: 'normal',
		FAST: 'fast',
	},
};

CONSTANTS.ANIMATION_CATEGORY = {
    NORMAL: 1,
    COLUMN_1: 2,
    COLUMN_2: 3,
    COLUMN_3: 4,
    ROW_1: 5,
    ROW_2: 6,
    ROW_3: 7,
    ROW_4: 8,
    ROW_5: 9
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

CONSTANTS.POKER_GAME_TYPE = {
	NORMAL: 0,
	TOURNAMENT: 1,
	CHALLENGER_GAME: 2,
	REMATCH: 3
};

CONSTANTS.PLAYER_ACTION = {
	SMALL_BLIND: 0,
	BIG_BLIND: 1,
	CHECK: 2,
	RAISE: 3,
	CALL: 4,
	FOLD: 6,
	TIMEOUT: 7,
	ALL_IN: 8,
};

CONSTANTS.GAME_PLAYER_STATUS = {
	PLAYING: 1,
	LEFT_KNOCKOUT: 2
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

CONSTANTS.DOWNGRADE_TYPE = {
    AFTER_SUBSCRIPTION_ENDS: 1,
    NEVER: 2
};

CONSTANTS.SUBSCRIPTION_FREQUENCY = {
    MONTHLY: 1,
    QUATERLY: 2
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

CONSTANTS.GAME_WINNER_TYPE = {
    SINGLE: 1,
    MULTIPLE: 2
};

CONSTANTS.PRIZE_TYPE = {
    TOKENS: 1,
    SELECTED_PRICE: 2
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

CONSTANTS.GAME_SETTING = {
    NAME_PREFIX: 'LUXE_',
    MIN_PLAYERS: 2,
    MAX_PLAYERS: 9
};

CONSTANTS.TABLE_LIMIT = {
    NO_LIMIT: 'no_limit',
    LIMIT: 'limit',
    POT_LIMIT: 'pot_limit'
};

CONSTANTS.GAME_WINNER_TYPE = {
    SINGLE: 1,
    MULTIPLE: 2
};

CONSTANTS.TIMER_TYPE = {
    MATCH_MAKING_TIMER: 1,
    PLAYER_TURN: 2,
    APPLY_BET_TIMER: 3
};

CONSTANTS.GAME_PARAMETERS = {
    EACH_PLAYER_CARDS_COUNT: 2,
    TABLE_CARDS_COUNT: 5,
    DELAY_AFTER_EACH_PLAYER_CARD_DISTRIBUTION: 1000,
    DELAY_AFTER_CARDS_DISTRIBUTION: 2000,
    PLAYER_TURN_TIMEOUT: 30000,
};

CONSTANTS.DUMMY_JSON = {
    PLAYER_TURN: {
        tableId: '',
        playerId: '',
        timer: 30,
        maxTimer: 30,
        buttonAction: {
            allIn: true,
            check: false,
            call: false,
            raise: true,
            minRaise: 100,
            maxRaise: 200,
            callAmount: 0,
            allInAmount: 0,
            tradeIn: false,
            tradeInLimit: 0
        }
    },
    PLAYED_TURN: {
        action: {
            playerId: '',
            tableId: '',
            betAmount: 0,
            action: 1,
            chipsLeft: 0
        }
    }
};

CONSTANTS.ROULETTE_TYPE = {
    AMERICAN: 1,
    EUROPEAN: 2,
    FRENCH: 3
};

CONSTANTS.SUIT_TYPE = {
    SINGLE: 1,
    SPECIFIC: 2,
    ANY: 3
};

CONSTANTS.SUIT_NAME = {
    HEART: 'Heart',
    DIAMOND: 'Diamond',
    SPADE: 'Spade',
    CLUB: 'Club'
};

CONSTANTS.SYMBOL_COLOR = {
    RED: 1,
    BLACK: 2
};

CONSTANTS.SYMBOL_TYPE = {
    ODD: 1,
    EVEN: 2
};

CONSTANTS.SLOT_GAME_THEME_VERSION = {
    OLD: 1,
    NEW: 2
};

CONSTANTS.SPINE_TYPE = {
    BACKGROUD: 1,
    FOREGROUND: 2
};

CONSTANTS.SYMBOLS_ANIMATION = {
    ROW: 1,
    COLUMN: 2
};

CONSTANTS.POKER_PLAYER_TURN_TYPE = {
    START_MATCH_MAKING: 1,
    PLAYED_TURN: 2
};

module.exports = CONSTANTS;