

function dateObjectManuplation(dateObj , timeStamp){
    let hour = dateObj.getHours();
    dateObj.setHours(hour-timeStamp);
    return dateObj;
}

module.exports = {
    dateObjectManuplation
}