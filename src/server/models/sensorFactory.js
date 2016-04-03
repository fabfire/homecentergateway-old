var countProp = 1;

var Sensor = function(data) {
    this.id = data.nodeid + '.' + countProp++;
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

function VCCSensor(data) {
    Sensor.call(this, data);
    this.value = data.pres;
    this.type = 'vcc';
}
VCCSensor.prototype = Object.create(Sensor.prototype);
VCCSensor.prototype.constructor = VCCSensor;

var Message = function(data) {
    this.msg = data.msg;
    this.date = data.date;
};

function createSensor(data){
    var sensors = [];
    countProp = 1;
    for (var property in data) {
        if (data.hasOwnProperty(property)) {
            switch (property) {
                case 'temp':
                    sensors.push(new TempSensor(data));
                    break;
                case 'hum':
                    sensors.push(new HumiditySensor(data));
                    break;
                case 'pres':
                    sensors.push(new PressureSensor(data));
                    break;
                case 'vcc':
                    sensors.push(new VCCSensor(data));
                    break;
                case 'msg':
                case 'err':
                    sensors.push(new Message(data));
                    break;
                default:
                    break;
            }
        }
    }
    return sensors;
}
exports.createSensor = createSensor;