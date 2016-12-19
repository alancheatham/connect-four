// const webpack = require('webpack');
// const WebpackDevServer = require('webpack-dev-server');
// const config = require('./webpack.config');

// const PORT = 3001;

// new WebpackDevServer(webpack(config), {
//     publicPath: config.output.publicPath,
//     hot: true,
//     historyApiFallback: true
// }).listen(PORT, 'localhost', (err, result) => {
//     if (err) {
//         return console.log(err);
//     }

//     console.log(`Listening at http://localhost:${PORT}/`);
// });

var app  = require('express')();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

var usernames = {};
var usersInChat = [];
var openGames = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/dist/cf.js',function(req,res){
    res.sendFile(__dirname + '/dist/cf.js'); 
});

io.on('connection', function(socket){
  socket.on('disconnect', function(){
    var index = usersInChat.indexOf(socket.id);
    if (index !== -1) {
        usersInChat.splice(index, 1);
        io.emit('chat update', usernames[socket.id] + ' left chat');
        io.emit('user chat update', usersInChat.map(function (id) {
           return usernames[id]; 
        }));
    }
  });

  socket.on('chat update', function(msg){
    io.emit('chat update', msg);
  });

  socket.on('user chat update', function(user, joined){
    if (joined) {
        usersInChat.push(socket.id);
        usernames[socket.id] = user;
        io.emit('chat update', user + ' joined chat');
    }
    else {
        usersInChat.splice(usersInChat.indexOf(socket.id), 1);
        io.emit('chat update', user + ' left chat');
    }
    io.emit('user chat update', usersInChat.map(function (id) {
       return usernames[id]; 
    }));
  });

  socket.on('get open games', function () {
    io.sockets.connected[socket.id].emit('get open games', openGames.map(function (id) {
        return usernames[id];
    }));
  })

  socket.on('create game', function() {
    openGames.push(socket.id);
    io.emit('open games update', openGames.map(function (id) {
        return usernames[id];
    }));
  });
});

http.listen(3000, function(){
  console.log('listening on port 3000');
});