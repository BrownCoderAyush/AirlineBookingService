const { StatusCodes } = require('http-status-codes');
const {BookingService}= require('../service/index');

const { createChannel , publishMessage } = require('../utils/messageQueue');
const {REMINDER_BINDING_KEY} = require('../config/serverConfig');

const bookingService = new BookingService();

class BookingController{
     constructor(){
         
    }
    async sendMessageToQueue(req,res){
        try {   
            const channel = await createChannel();
            // demo request 
            const payload = { 

                data : {
                    subject : 'this is a noti from queue',
                    content : 'Queue will subscribe to msg',
                    recipientEmail :  'ayushplayssoft@gmail.com',
                    notificationTime : '2023-01-03 13:44:07',
                    status : 'PENDING'
                },

                service : 'CREATE_TICKET' 

                
            }; 
            publishMessage(channel , REMINDER_BINDING_KEY , JSON.stringify(payload));
            return res.status(200).json({
                message : 'Succesfully published the event'
            })
        } catch (error) {
            throw error ; 
        }
    }

    async create(req,res){
        try {
            const  response  = await bookingService.createBooking(req.body);
            return res.status(StatusCodes.OK).json({
                message: 'Successfully created booking',
                success: true,
                err: {},
                data: response
            })
        } catch (error) {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                err: error.explanation,
                data: {}
            })
        }
    } 
    
}


module.exports = BookingController