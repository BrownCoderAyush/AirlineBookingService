const { StatusCodes } = require('http-status-codes');
const {BookingService}= require('../service/index');

const { createChannel , publishMessage } = require('../utils/messageQueue');
const {REMINDER_BINDING_KEY} = require('../config/serverConfig');

const bookingService = new BookingService();

class BookingController{
    constructor(channel){
        
    }
    async sendMessageToQueue(req,res){
        try {
            
            const channel = await createChannel();
            const data = { message : 'Success'} ; 
            publishMessage(channel , REMINDER_BINDING_KEY , json.stringify(data));
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
// const create=async(req,res)=>{
//     try {
//         const  response = await bookingService.createBooking(req.body);
//         return res.status(StatusCodes.OK).json({
//             message: 'Successfully created booking',
//             success: true,
//             err: {},
//             data: response
//         })
//     } catch (error) {
//         return res.status(error.statusCode).json({
//             message: error.message,
//             success: false,
//             err: error.explanation,
//             data: {}
//         })
//     }
// }

module.exports = BookingController