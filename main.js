document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const usersList = document.getElementById('users');
  const messageContainer = document.getElementById('messages');
  const messageInput = document.getElementById('message-input');
  const sendButton = document.getElementById('send-button');
  const registerButton = document.getElementById('register-button');
  const registerUserBtn = document.getElementById('registerUserBtn');
  const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
  let selectedUser = null;

  fetchAllUsers();

  function fetchAllUsers() {
    fetch('http://localhost:8485/users')
      .then((response) => response.json())
      .then((data) => {
        usersList.innerHTML = '';
        data.forEach((user) => {
          const userItem = document.createElement('li');
          userItem.innerText = `${user.first_name} ${user.last_name}`;
          userItem.addEventListener('click', () => {
            selectedUser = user;
            openChatWithUser(selectedUser);
            fetchMessages(selectedUser.id);
          });
          usersList.appendChild(userItem);
        });
      })
      .catch((error) => console.error('Error fetching users:', error));
  }

  function openChatWithUser(user) {
    messageContainer.innerHTML = `<div><strong>Chat with ${user.first_name} ${user.last_name}</strong></div>`;
  }

  function fetchMessages(userId) {
    fetch(`http://localhost:8485/messages/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        messageContainer.innerHTML = '';
        data.forEach((message) => {
          const messageElement = document.createElement('div');
          messageElement.innerText = `${message.user_first_name} ${message.user_last_name}: ${message.content}`;
          messageContainer.appendChild(messageElement);
        });
      })
      .catch((error) => console.error('Error fetching messages:', error));
  }

  sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message && selectedUser) {
      sendMessage(selectedUser.id, message);
      messageInput.value = '';
    }
  });

  function sendMessage(userId, content) {
    fetch(`http://localhost:8485/messages/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: content,
      }),
    })
      .then((response) => response.json())
