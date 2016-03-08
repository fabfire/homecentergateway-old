// Socket connection : the line below will be replaced by gulp
var url;
var socket = io.connect(url);

socket.on('new client', function(data) {
    console.log(data);
    kendoConsole.log(JSON.stringify(data));
    //socket.emit('event from client', { my: 'data from client' });
});

socket.on('message', function(data) {
    console.log(data);
    kendoConsole.log(JSON.stringify(data));
    //socket.emit('event from client', { my: 'data from client after message' });
});

kendo.init($('.console'));