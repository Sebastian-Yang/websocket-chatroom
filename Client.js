const io = require('socket.io-client');
const cout = process.stdout;
const cin = process.stdin;


const socket = io.connect('http://localhost:8080');

var local_id = null;

socket.on('connect',function(){
	console.log("Connected")
	local_id = process.argv[2]
	socket.emit('data', {
		id: local_id,
	})
	
});

socket.on('error', function(event){
	console.log(event)
});

socket.on('message', function(msg){
	console.log(msg.source_id + ': ' + msg.message);
});

socket.on('people_out', function(data){
	console.log(data.id + ' is left.')
});

socket.on('people_in', function(data){
	// console.log(data.socket_id + ' is join the party.')
	console.log('There is ' +　data.cnt + ' people online.')
});

cin.on('data', function(chunk){
	if(chunk.toString() != '\r\n'){
		msg = (chunk+'').replace(/[\r\n]/ig,"");

		if(msg.toLowerCase() == 'exit' || msg.toLowerCase() == 'quit'){
			console.log("You have disconnected from the server.")
			socket.disconnect();
		}else{
			socket.emit('message',{
				message: msg,
				id: local_id,
			});
		}

	}
});

