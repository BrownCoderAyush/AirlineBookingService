const express = require('express');
const { BookingController } = require('../../controllers/index');
const router = express.Router();



const bookingController = new BookingController();

router.get('/info' , (req,res)=>{
    res.json({
        msg : 'info'
    })
})

router.post('/bookings' , bookingController.create);
router.post('/publish' , bookingController.sendMessageToQueue);

module.exports = router;