const express = require('express');
const bodyParser = require('body-parser');

const {PORT , DB_SYNC} = require('./config/serverConfig');
const apiRoutes = require('./routes/index');
const db = require('./models/index');

const app = express();

const setupAndStartServer = ()=>{

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use('/bookingservice/api' , apiRoutes);


    app.listen(PORT , ()=>{
        console.log(`Server started running on port ${PORT}`);
        if(DB_SYNC){
            db.sequelize.sync({alter:true});
        }
    })
}


setupAndStartServer();