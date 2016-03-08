module.exports = function() {
    this.createProbe = function(data) {
        var probe;

        if ('temp' in data && 'hum' in data && 'pres' in data) {
            probe = new HumidityPressureTempProbe(data);
        } else if ('temp' in data && 'hum' in data) {
            probe = new HumidityTempProbe(data);
        } else if ('temp' in data) {
            probe = new TempProbe(data);
        } else if ('msg' in data) {
            probe = new MessageProbe(data);
        }

        return probe;
    };
}

var TempProbe = function(data) {
    this.nodeid = data.nodeid;
    this.temp = data.temp / 100;
    this.date = data.date;
};

var HumidityTempProbe = function(data) {

};

var HumidityPressureTempProbe = function(data) {

};

var MessageProbe = function(data) {
    this.msg = data.msg;
};

