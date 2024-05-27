const userId = prompt("Enter your nickname");

const ws = new WebSocket(
  `wss://calculator-api-python.azurewebsites.net/ws/${userId}`
);

ws.onmessage = function (event) {
  const outputDiv = document.getElementById("output");
  const message = JSON.parse(event.data);
  if (message.type === "user_list") {
    updateUsersList(message.users);
  } else {
    const divElement = document.createElement("div");
    divElement.className = "message received";
    const messageElement = document.createElement("p");
    messageElement.textContent = `${message.user}: ${message.data}`;
    divElement.appendChild(messageElement);
    outputDiv.appendChild(divElement);
  }
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

function getRandomPosition(element) {
  const container = document.getElementById("container");
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const elementWidth = element.clientWidth;
  const elementHeight = element.clientHeight;

  // Ajustar para que no se salga del contenedor
  const maxX = containerWidth - elementWidth;
  const maxY = containerHeight - elementHeight;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  return { x: randomX, y: randomY };
}

function toggleImage(id) {
  debugger;
  const image = document.getElementById(id);

  if (image.style.display === "none" || image.style.display === "") {
    const position = getRandomPosition(image);
    image.style.left = `${position.x}px`;
    image.style.top = `${position.y}px`;
    image.style.display = "block";
    image.style.opacity = 1;
  } else {
    image.style.opacity = 0;
    setTimeout(() => {
      image.style.display = "none";
    }, 10); // Espera a que termine la transición de opacidad
  }
}

function updateUsersList(users) {
  const usersList = document.getElementById("usersList");
  usersList.innerHTML = ""; // Clear the list
  users.forEach((user) => {
    const userItem = document.createElement("li");
    userItem.textContent = user;
    usersList.appendChild(userItem);
  });
}

setInterval(() => toggleImage("randomImage1"), Math.random() * 5000);
setInterval(() => toggleImage("randomImage2"), Math.random() * 5000);
setInterval(() => toggleImage("randomImage3"), Math.random() * 5000);
setInterval(() => toggleImage("randomImage4"), Math.random() * 5000);
setInterval(() => toggleImage("randomImage5"), Math.random() * 5000);
setInterval(() => toggleImage("randomImage6"), Math.random() * 5000);
setInterval(() => toggleImage("randomImage7"), Math.random() * 5000);
setInterval(() => toggleImage("randomImage8"), Math.random() * 5000);
setInterval(() => toggleImage("randomImage9"), Math.random() * 5000);
setInterval(() => toggleImage("randomImage10"), Math.random() * 5000);
setInterval(() => toggleImage("randomImage11"), Math.random() * 5000);
setInterval(() => toggleImage("randomImage12"), Math.random() * 5000);
