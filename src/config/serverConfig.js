const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    PORT : process.env.PORT , 
    DB_SYNC : process.env.DB_SYNC,
    FLIGHT_SERVICE_PATH : process.env.FLIGHT_SERVICE_PATH,
    REMINDER_SERVICE_PATH : process.env.REMINDER_SERVICE_PATH
}