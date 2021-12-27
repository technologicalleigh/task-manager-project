const date = new Date();
const day = date.getDay();
const numDate = date.getDate();
const month = date.getMonth();
const year = date.getFullYear();
const hour = date.getHours();

var dayOfWeek, monthName, getHour, ampm;

switch(day){
    case(1):
        dayOfWeek = 'Monday';
        break;
    case(2):
        dayOfWeek = 'Tuesday';
        break;
    case(3):
        dayOfWeek = 'Wednesday';
        break;
    case(4):
        dayOfWeek = 'Thursday';
        break;
    case(5):
        dayOfWeek = 'Friday';
        break;
    case(6):
        dayOfWeek = 'Saturday';
        break;
    case(0):
        dayOfWeek = 'Sunday';
        break;

}

switch(month){
    case(1):
        monthName = 'January';
        break;
    case(2):
        monthName = 'February';
        break;
    case(3):
        monthName = 'March';
        break;
    case(4):
        monthName = 'April';
        break;
    case(5):
        monthName = 'May';
        break;
    case(6):
        monthName = 'June';
        break;
    case(7):
        monthName = 'July';
        break;
    case(8):
        monthName = 'August';
        break;
    case(9):
        monthName = 'September';
        break;
    case(10):
        monthName = 'October';
        break;
    case(11):
        monthName = 'November';
        break;
    case(12):
        monthName = 'December';
        break;

}

switch(hour){
    case(13):
        getHour = 1;
        break;
    case(14):
        getHour = 2;
        break;
    case(15):
        getHour = 3;
        break;
    case(16):
        getHour = 4;
        break;
    case(17):
        getHour = 5;
        break;
    case(18):
        getHour = 6;
        break;
    case(19):
        getHour = 7;
        break;
    case(20):
        getHour = 8;
        break;
    case(21):
        getHour = 9;
        break;
    case(22):
        getHour = 10;
        break;
    case(23):
        getHour = 11;
        break;
    default:
        getHour = hour;
}

if(getHour<12){
    ampm = "AM";
}else{
    ampm="PM";
}

var stringDate = dayOfWeek+' '+monthName+' '+numDate+', '+year;

var getTime = getHour+':'+ date.getMinutes();

var setDateProp = {
    date: stringDate,
    time: getTime,
    isAmOrPm: ampm
};

module.exports = setDateProp;