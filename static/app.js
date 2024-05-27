var client_id = prompt("Enter your nickname");
document.querySelector("#ws-id").textContent = client_id;
var ws = new WebSocket(
  `wss://calculator-api-python.azurewebsites.net/ws/${client_id}`
);

ws.onmessage = function (event) {
  const messages = document.getElementById("messages");
  const message = document.createElement("div");
  message.classList.add("message");
  const content = document.createElement("div");
  content.classList.add("content");

  if (event.data.startsWith("Connected clients:")) {
    updateUsers(event.data);
  } else {
    const text = event.data;
    if (text.startsWith(`${client_id} says:`)) {
      message.classList.add("sent");
    } else {
      message.classList.add("received");
    }
    content.textContent = text;
    message.appendChild(content);
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }
};

function sendMessage(event) {
  const input = document.getElementById("messageText");
  ws.send(input.value);
  input.value = "";
  event.preventDefault();
}

function updateUsers(data) {
  const userList = document.getElementById("user-list");
  userList.innerHTML = "";
  const users = data.replace("Connected clients: ", "").split(",");
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user;
    userList.appendChild(li);
  });
}

function getRandomPosition(element) {
  const container = document.getElementById("chat-container");
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
