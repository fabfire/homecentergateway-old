  var socket = io.connect('http://localhost:3000');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('event from client', { my: 'data from client' });
  });
  
socket.on('message', function (data) {
    console.log(data);
    socket.emit('event from client', { my: 'data from client after message' });
  });