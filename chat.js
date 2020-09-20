// Make connection
let socket = io.connect('http://localhost:4000');

//Query DOM
// Query DOM
let message = document.getElementById('message'),
      name = document.getElementById('name'),
      sendBtn = document.getElementById('send'),
      clearBtn = document.getElementById('clear');
      output = document.getElementById('output'),
      feedback = document.getElementById('feedback');

// Emit events
sendBtn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        name: name.value
    });
    message.value = "";
  });

  message.addEventListener('keypress', function(){
    socket.emit('typing', name.value);
})

  //Listen for events
  socket.on('chat', function(data){
    feedback.innerHTML = "";
    output.innerHTML += '<p><strong>' + data.name + ': </strong>' + data.message + '</p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});
