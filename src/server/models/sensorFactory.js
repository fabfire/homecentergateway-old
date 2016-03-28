var Sensor = function(data) {
    this.nodeid = parseInt(data.nodeid);
    this.name = '';
    this.date = data.date;
};

function TempSensor(data) {
    Sensor.call(this, data);
    this.value = data.temp / 100;
    this.type = 'temp';
}
TempSensor.prototype = Object.create(Sensor.prototype);
TempSensor.prototype.constructor = TempSensor;

function HumiditySensor(data) {
    Sensor.call(this, data);
    this.value = data.hum / 100;
    this.type = 'hum';
}
HumiditySensor.prototype = Object.create(Sensor.prototype);
HumiditySensor.prototype.constructor = HumiditySensor;

function PressureSensor(data) {
    Sensor.call(this, data);
    this.value = data.pres;
    this.type = 'pres';
}
PressureSensor.prototype = Object.create(Sensor.prototype);
PressureSensor.prototype.constructor = PressureSensor;

var Message = function(data) {
    this.msg = data.msg;
    this.date = data.date;
};

module.exports = function() {
    this.createSensor = function(data) {
        var sensors = [];
        if ('temp' in data) {
            sensors.push(new TempSensor(data));
        }
        if ('hum' in data) {
            sensors.push(new HumiditySensor(data));
        }
        if ('pres' in data) {
            sensors.push(new PressureSensor(data));
        }
        if ('msg' in data) {
            sensors.push(new Message(data));
        }

        return sensors;
    };
};