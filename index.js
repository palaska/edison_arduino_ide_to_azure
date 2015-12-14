// Add reference to the Azure IoT Hub device library
var device = require('azure-iot-device');
//var connectionString = 'HostName=OpenLabIstanbul.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=fFIZA4x/MZ6EJXYFLT06EF/5C0kPLLmA6RhBNY15c2Y=';
var connectionString = 'HostName=OpenLabIstanbul.azure-devices.net;DeviceId=MyEdison;SharedAccessKey=KBFNE7LCVXgpqZv1qbeDNDUbsbyroimBEZuR0ZNANLg=';
// Create the client instance specifying the preferred protocol
var client = new device.Client.fromConnectionString(connectionString);


var serialport = require('serialport');// include the library
var SerialPort = serialport.SerialPort; // make a local instance of it
//var portName = '/dev/cu.usbmodem1a123';
// get port name from the command line:
var portName = process.argv[2];

var myPort = new SerialPort(portName, {
    baudRate: 9600,
    // look for return and newline at the end of each data packet:
    parser: serialport.parsers.readline("\n")
 });


// list serial ports:
serialport.list(function (err, ports) {
  ports.forEach(function(port) {
    console.log(port.comName);
  });
});

myPort.on('open', showPortOpen);
myPort.on('data', sendSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}

function sendSerialData(mydata) {
   //console.log(mydata);
    //Create a message and send it to IoT Hub.
   var data = JSON.stringify({ 'deviceId': 'MyEdison', 'data': mydata });
   var message = new device.Message(data);
   message.properties.add('myproperty', 'myvalue');
   console.log("Sending message: " + message.getData());
   client.sendEvent(message, printResultFor('send'));
}

function showPortClose() {
   console.log('port closed.');
}

function showError(error) {
   console.log('Serial port error: ' + error);
}
// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res && (res.statusCode !== 204)) console.log(op + ' status: ' + res.statusCode + ' ' + res.statusMessage);
  };
}
