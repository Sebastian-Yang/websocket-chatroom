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

//Client connect to server
io.on('connection',function(socket){
	people_cnt++;

	//Client disconnect from the server
	socket.on('disconnect', function(){
		people_cnt--;
		console.log(socket.id + ' is disconnected.')
		socket.broadcast.emit('people_out', {		//Broadcast to all online users
			id: socket.name,
			cnt: people_cnt
		})
	});

	//Recieve messaga
	socket.on('message', function(data){
		// console.log(socket.id + '  ' + msg);
		socket.broadcast.emit('message', {			//Broadcast to all online users
			message: data.message,					//except the one who fire the event
			source_id: data.id,
		});
	});

	//Recieve user's ID
	socket.on('data',function(data){
		socket.name = data.id;						//Pass user's ID to object socket's name parameter
		console.log(socket.name + ' is connected.')
		socket.broadcast.emit('people_in', {
			socket_id: socket.name,
			cnt: people_cnt
		})
		console.log('There is ' + people_cnt + ' people online.')
	});


});

//Collect admin's input data
cin.on('data', function(chunk){
	if(chunk.toString() != '\r\n'){
		msg = (chunk+'').replace(/[\r\n]/ig,"");

		//If the string is 'exit' or 'quit' then close the server
		if(msg.toLowerCase() == 'exit' || msg.toLowerCase() == 'quit'){
			console.log("Server closed.")
			io.close();
		}else{
			//Otherwise broadcast to all users as administrator
			io.sockets.emit('message',{
				message: msg,
				source_id: "admin",
			});
		}

	}
});

