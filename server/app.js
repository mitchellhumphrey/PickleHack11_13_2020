
window.onload = function() {

  // Get references to elements on the page.
  var form = document.getElementById('message-form');
  var messageField = document.getElementById('message');
  var messagesList = document.getElementById('messages');
  var socketStatus = document.getElementById('status');
  var closeBtn = document.getElementById('close');
  var pickleBtn = document.getElementById('pickle');

  // Create a new WebSocket.
  var socket = new WebSocket('ws://192.168.1.23:8080',"echo-protocol");


  // Handle any errors that occur.
  socket.onerror = function(error) {
    console.log('WebSocket Error: ' + error);
  };


  // Show a connected message when the WebSocket is opened.
  socket.onopen = function(event) {
    console.log(event);
    socketStatus.innerHTML = 'Pickled to: ' + event.currentTarget.url;
    socketStatus.className = 'open';
  };


  // Handle messages sent by the server.
  socket.onmessage = function(event) {
    var message = JSON.parse(event.data);
    messagesList.innerHTML += '<li class="received"><span>Pickle '+message.name+':</span>' +
                               message.data + '</li>';
    var liList = messagesList.getElementsByTagName("li");
    if (liList.length > 15){
      liList[0].remove();      
    }
    


  };


  // Show a disconnected message when the WebSocket is closed.
  socket.onclose = function(event) {
    socketStatus.innerHTML = 'Disconnected from WebSocket.';
    socketStatus.className = 'closed';
  };


  // Send a message when the form is submitted.
  form.onsubmit = function(e) {
    e.preventDefault();

    // Retrieve the message from the textarea.
    var message = messageField.value;

    if (isValidMessage(message)){
      // Send the message through the WebSocket.
      socket.send(message);

      // Clear out the message field.
      messageField.value = '';

      
    }
    else{
      alert("Not a Pickle")
      messageField.value = '';
    }

    return false;
  };


  // Close the WebSocket connection when the close button is clicked.
  closeBtn.onclick = function(e) {
    e.preventDefault();

    // Close the WebSocket.
    socket.close();

    return false;
  };

  pickleBtn.onclick = function(e) {
    e.preventDefault();
    messageField.value += "🥒"
  }


  function isValidMessage(text){
    var temp = text
    temp = temp.replace(/🥒|!|\?|>|<|@|#|\$|%|\^|&|\*|\(|\)|,|\./g, "")
    temp = temp.replace(/\s/g, "")
    temp = temp.replace (/\n/g,'')
    console.log(temp)
    
    let regex = new RegExp("^(pickle)*(p(i(c(kl?)?)?)?)?$")
    return regex.test(temp.toLowerCase())
  }

};