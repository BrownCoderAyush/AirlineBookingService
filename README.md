# Welcome to Booking Service 

# Project Setup 

- clone the project on your local.
- Execute `npm install` on the same path as of your root directory of the downloaded project. 
- Create a `.env` file in the root directory and add the following environment variable.

```
PORT=3002
FLIGHT_SERVICE_PATH='http://localhost:8000'
REMINDER_SERVICE_PATH='http://localhost:3003'
EXCHANGE_NAME=AIRLINE_BOOKING
REMINDER_BINDING_KEY=REMINDER_SERVICE
MESSAGE_BROKER_URL='amqp://localhost'
```
- Inside the `src/config` folder create a new file `config.json` and then add the following piece of json

```
{
  "development": {
    "username": <YOUR_DB_LOGIN_NAME>,
    "password": <YOUR_DB_PASSWORD>,
    "database": "BOOKING_DB_DEV",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

```

- Once you've added your db config as listed above, go to the src folder from your terminal and execute `npx sequelize db:create`
and then execute `npx sequelize db:migrate`

---

# API

## Booking Model 

- Schema example 

```
  {
        "id": 12,
        "flightId": "1",
        "noOfSeats": "3",
        "userId": "2",
        "totalCost": 7200,
        "status": "Booked",
        "updatedAt": "2023-04-23T06:00:11.774Z",
        "createdAt": "2023-04-23T06:00:11.774Z"
    }

```

---

**Desc**: Create Booking 

**Route** : `/bookings`

**Method**: `POST`

**Body** : 

```
{

    "flightId" : 1 , 
    "noOfSeats" : 3 , 
    "userId" : 2

}
  
```

**Response** : 

```
{
    "message": "Successfully created booking",
    "success": true,
    "err": {},
    "data": {
        "id": 12,
        "flightId": "1",
        "noOfSeats": "3",
        "userId": "2",
        "totalCost": 7200,
        "status": "Booked",
        "updatedAt": "2023-04-23T06:00:11.774Z",
        "createdAt": "2023-04-23T06:00:11.774Z"
    }
}
```
---

**Desc**: Publish Message 

**Route** : `/publish`

**Method**: `POST`

**Body** : 

```
{
    "subject" : 'this is a noti from queue',
    "content" : 'Queue will subscribe to msg',
    "recipientEmail" :  'ayushplayssoft@gmail.com',
    "notificationTime" : '2023-01-03 13:44:07',
    "status" : 'PENDING'
}
  
```

**Response** : 

```
{
  "message" : 'Succesfully published the event'
}
```

