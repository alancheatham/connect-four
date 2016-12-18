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

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/dist/cf.js',function(req,res){
    res.sendFile(__dirname + '/dist/cf.js'); 
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat update', function(msg){
    io.emit('chat update', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on port 3000');
});