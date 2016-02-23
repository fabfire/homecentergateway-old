  var socket = io.connect('http://localhost:5000');
  socket.on('news', function (data) {
    console.log(data);
    kendoConsole.log(JSON.stringify(data));
    socket.emit('event from client', { my: 'data from client' });
  });
  
socket.on('message', function (data) {
    console.log(data);
    kendoConsole.log(JSON.stringify(data));
    //socket.emit('event from client', { my: 'data from client after message' });
  });
  
  
kendo.init($(".console"));