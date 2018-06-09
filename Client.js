const io = require('socket.io-client');
const cout = process.stdout;
const cin = process.stdin;

//Connect to server
const socket = io.connect('http://localhost:8080');		

//Define user's ID
var local_id = null;

//Client connect to the server
socket.on('connect',function(){
	console.log("Connected")
	local_id = process.argv[2]		//Pass the parameter as user's ID
	socket.emit('data', {
		id: local_id,				//Send user's ID to server
	})
	
});

//Error event
socket.on('error', function(event){
	console.log(event)
});


//Message event
socket.on('message', function(msg){
	console.log(msg.source_id + ': ' + msg.message);
});


//People left the chatroom
socket.on('people_out', function(data){
	console.log(data.id + ' is left.')
});

//People join the chatroom
socket.on('people_in', function(data){
	// console.log(data.socket_id + ' is join the party.')
	console.log('There is ' +　data.cnt + ' people online.')
});

//Collect user's input string
cin.on('data', function(chunk){
	if(chunk.toString() != '\r\n'){
		msg = (chunk+'').replace(/[\r\n]/ig,"");

		//If the string is 'exit' or 'quit' then disconnect from the server
		if(msg.toLowerCase() == 'exit' || msg.toLowerCase() == 'quit'){
			console.log("You have disconnected from the server.")
			socket.disconnect();		
		}else{
			//Otherwise send the string and the user ID to the server
			socket.emit('message',{
				message: msg,
				id: local_id,
			});
		}

	}
});

