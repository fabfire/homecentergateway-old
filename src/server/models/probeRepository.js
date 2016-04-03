var moment = require('moment');
var probes = [];

module.exports = function() {
    // Sometimes, sensors send same packets 2 or 3 times.
    // if the packet is the same than the previous one (1-2 sec before), we skip it
    this.checkUnicity = function(data) {
        if (data && data.date) {
            var currentDate = moment(data.date);
            currentDate = currentDate.add(-3, 'seconds');
            //console.log('date      : ' + currentDate.toString());

            if (probes[data.id] && moment(probes[data.id].date) > currentDate && data.msg === undefined) {
                var previousDate = moment(probes[data.id].date);
                // skip it because it's the same than previous value
                // console.log('prev date : ' + previousDate.toString());
                // console.log('skip : ' + JSON.stringify(data));
                // console.log('probes : ' + JSON.stringify(probes));
                return false;
            }
            else {
                probes[data.id] = data;
                return true;
            }
        }
    };
};
