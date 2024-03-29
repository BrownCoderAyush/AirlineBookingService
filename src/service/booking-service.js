const axios = require('axios');

const {FLIGHT_SERVICE_PATH , REMINDER_SERVICE_PATH} = require('../config/serverConfig');
const {BookingRepository} = require('../repository/index');
const { ServiceError } = require('../utils/error/index');
const {dateObjectManuplation} = require('../utils/DateObjectManuplation');

class BookingService {
        constructor(){
            this.bookingRepository = new BookingRepository();
        }

        async createBooking(data){
            try {
                console.log(data);
                /*
                Getting flight data from {flightsAndSearch} Service based on flightId received from client-end  
                */
                const flightId = data.flightId; 
                let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
                const flight = await axios.get(getFlightRequestURL);
                console.log("flight details",flight);
                /*
                labeling required information from flight detail
                */
                const flightData = flight.data.data; 
                let priceOfFlight = flightData.price;

                /*
                In case no. of seats required is not available for booking throw error mentioned below
                */ 
                if(data.noOfSeats > flightData.totalSeats){
                   throw new ServiceError('Something went wrong in booking process ' , 'Insufficient seats in the flight');
                }

                /*
                Adding details to booking payload prior to create booking
                */
                const totalCost = priceOfFlight*data.noOfSeats;
                const bookingPayload = {...data , totalCost   , status : 'Booked'};

                /*
                booking creation in db
                */
                const booking = await this.bookingRepository.create(bookingPayload);
                
                /*
                Request to {flightsAndSearch} for updating the seats left in the current flight 
                */
                const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
                await axios.patch(updateFlightRequestURL , {
                    totalSeats : flightData.totalSeats - booking.noOfSeats
                });

                /*
                Request to {AuthService} for user email using userId
                */
                const userId = data.userId;
                const getUserEmailURL = `http://localhost:3001/api/v1/users/${userId}`;
                const user = await axios.get(getUserEmailURL);
                
                const userEmail = user.data.data.email;
              
                
                /*
                Request to {ReminderService} for creating notification_reminder so as to send email notification before 12 hours from flight departure 
                */
                const postReminderServiceURL = `${REMINDER_SERVICE_PATH}/api/v1/tickets`; 
                const departureTime = flightData.departureTime;
                    /*
                    dateObject that will be sended to reminder service for prior ( 12 hours )notification email 
                    */
                const reminderDateObj = dateObjectManuplation(new Date(departureTime) , 12);
                const reminder = await axios.post(postReminderServiceURL,{
                    subject : 'flight Alert Reminder',
                    content : 'reminder',
                    recipientEmail : userEmail,
                    status : 'PENDING' , 
                    notificationTime : reminderDateObj
                })

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