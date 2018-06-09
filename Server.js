var express = require('express');
var socket = require('socket.io');

const cout = process.stdout;
const cin = process.stdin;

var port = process.env.PORT || 8080;

var app = express();
var server = app.listen(port,function(){
	console.log('Listen to requests on port %d', port);
});

var io = socket(server);
var people_cnt = 0;

io.on('connection',function(socket){
	people_cnt++;

	socket.on('disconnect', function(){
		people_cnt--;
		console.log(socket.id + ' is disconnected.')
		socket.broadcast.emit('people_out', {
			id: socket.name,
			cnt: people_cnt
		})
	});

	socket.on('message', function(data){
		// console.log(socket.id + '  ' + msg);
		socket.broadcast.emit('message', {
			message: data.message,
			source_id: data.id,
			source_token: data.token
		});
	});

	socket.on('data',function(data){
		socket.name = data.id
		console.log(socket.name + ' is connected.')
		socket.broadcast.emit('people_in', {
			socket_id: socket.id,
			cnt: people_cnt
		})
		console.log('There is ' + people_cnt + ' people online.')
	});


});


cin.on('data', function(chunk){
	if(chunk.toString() != '\r\n'){
		msg = (chunk+'').replace(/[\r\n]/ig,"");

		if(msg.toLowerCase() == 'exit' || msg.toLowerCase() == 'quit'){
			console.log("Server closed.")
			io.close();
		}else{
			io.sockets.emit('message',{
				message: msg,
				source_id: "admin",
			});
		}

	}
});
