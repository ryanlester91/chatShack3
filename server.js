//Should I include express? Utils?
const mongo = require('mongodb').MongoClient;
const io = require('socket.io').listen(4000).sockets;

//Connect to MongoDB
mongo.connect('mongodb://127.0.0.1/mongochat', (err, client) {
    if(err){
        throw err;
    }
    console.log('MongoDB connected...');
    //What to do with db variable?
    const db = client.db('mongochat');

    //connect to Socket.io
    io.on('connection', function(socket) {
        let chat = client.db('mongochat').collection('chats')

        // Create function to send status
        sendStatus = function(s) {
            socket.emit('status', s);
        }

        //Get chats from mongo collection
        chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
            if(err){
                throw err;
            }
            //Emit the messages
            socket.emit('output', res);
        });

        //Handle input events
        io.on('input', function(data){
            let name = data.name;
            let message = data.message;

            //Check for name and message
            if(name == '' || message == ''){
                //Send error status
                sendStatus('Please enter a name and message');
            } else {
                // Insert message
                chat.insert({name: name, message: message}, function(){
                    client.emit('output', [data]);

                    //Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    })
                })
            }
        })

        //Handle clear
        io.on('clear', function(data){
            //Remove all chats from collection
            chat.remove({}, function(){
                //Emit cleared
                socket.emit('cleared')
            })
        })
    })
});
