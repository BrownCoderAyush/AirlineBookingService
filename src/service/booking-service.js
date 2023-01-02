const axios = require('axios');

const {FLIGHT_SERVICE_PATH} = require('../config/serverConfig');
const {BookingRepository} = require('../repository/index');
const { ServiceError } = require('../utils/error/index');

class BookingService {
        constructor(){
            this.bookingRepository = new BookingRepository();
        }

        async createBooking(data){
            try {
                const flightId = data.flightId; 
                // console.log("flight id " , flightId);
                // console.log('before flight fetch');
                let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
                const flight = await axios.get(getFlightRequestURL);
                // console.log(flight);
                const flightData = flight.data.data;
                // console.log(flightData);
                let priceOfFlight = flightData.price;
                // console.log('after flight fetch' , priceOfFlight);
                // console.log("price is " , priceOfFlight);
                if(data.noOfSeats > flightData.totalSeats){
                   throw new ServiceError('Something went wrong in booking process ' , 'Insufficient seats in the flight');
                }
                const totalCost = priceOfFlight*data.noOfSeats;
                const bookingPayload = {...data , totalCost   , status : 'Booked'};
                // bookingPayload = {...bookingPayload , status : 'Booked'};
                console.log("bfi",bookingPayload.flightId)
                const booking = await this.bookingRepository.create(bookingPayload);
                console.log('booking' , booking);
                const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
                await axios.patch(updateFlightRequestURL , {
                    totalSeats : flightData.totalSeats - booking.noOfSeats
                });

                return booking;

            } catch (error) {
                console.log(error);
                if(error.name == 'SequelizeValidationError' || error.name =='RepositoryError' || error.name =='ServiceError'){
                    throw error;
                }
                throw new ServiceError();
            }
        }
}

module.exports = BookingService;