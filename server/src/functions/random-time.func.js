function randomTime (start, end) {
    var diff =  end.getTime() - start.getTime();
    var new_diff = diff * Math.random();
    var date = new Date(start.getTime() + new_diff);
    return date;
};

var endTime = new Date();
var startTime = new Date();
startTime.setFullYear(endTime.getFullYear() - 1);
var birthdayStartTime = new Date();
birthdayStartTime.setFullYear(endTime.getFullYear() - 70);

module.exports = {
    randomTime: randomTime,
    endTime: endTime,
    startTime: startTime,
    birthdayStartTime: birthdayStartTime
};


