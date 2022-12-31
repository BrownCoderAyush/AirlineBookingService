const axios = require('axios');

const {FLIGHT_SERVICE_PATH} = require('../config/serverConfig');
const {BookingRepository} = require('../repository/index');
const { ServiceError } = require('../utils/error/index');

class BookingService {
        constructor(){
            this.bookingRepository = BookingRepository;
        }

        async createBooking(data){
            try {
                const flightId = data.flightId; 
                let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
                const flight = await axios.get(getFlightRequestURL);
                // console.log("data is :" , flight.data);
                return flight.data.data;

            } catch (error) {
                console.log(error);
                throw new ServiceError()
            }
        }
}

module.exports = BookingService;