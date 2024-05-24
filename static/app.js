const userId = prompt("Enter your nickname");

const ws = new WebSocket(
  `wss://calculator-api-python.azurewebsites.net/ws/${userId}`
);

ws.onmessage = function (event) {
  const outputDiv = document.getElementById("output");
  const message = JSON.parse(event.data);
  const divElement = document.createElement("div");
  divElement.className = "message received";
  const messageElement = document.createElement("p");
  messageElement.textContent = `${message.user}: ${message.data}`;
  divElement.appendChild(messageElement);
  outputDiv.appendChild(divElement);
};

function sendMessage() {
  const messageInput = document.getElementById("messageInput");
  const message = messageInput.value;
  if (message.trim()) {
    ws.send(message);
    const outputDiv = document.getElementById("output");
    const divElement = document.createElement("div");
    divElement.className = "message sent";
    const messageElement = document.createElement("p");
    messageElement.textContent = `${message}`;
    divElement.appendChild(messageElement);
    outputDiv.appendChild(divElement);
    outputDiv.scrollTop = outputDiv.scrollHeight;

    messageInput.value = "";
    toggleSendButton();
  }
}

function checkEnter(event) {
  if (event.key === "Enter") {
    sendMessage();
    event.preventDefault(); // Prevents the default behavior of the Enter key
  }
}

function toggleSendButton() {
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  if (messageInput.value.trim() === "") {
    sendButton.style.display = "none";
  } else {
    sendButton.style.display = "block";
  }
}
