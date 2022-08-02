"use strict";

var username;
var socket = io();

do {
  username = prompt('Enter your name: ');
} while (!username);

var textarea = document.querySelector('#textarea');
var submitBtn = document.querySelector('#submitBtn');
var commentBox = document.querySelector('.comment__box');
submitBtn.addEventListener('click', function (e) {
  e.preventDefault();
  var comment = textarea.value;

  if (!comment) {
    return;
  }

  postComment(comment);
});

function postComment(comment) {
  // Append to dom
  var data = {
    username: username,
    comment: comment
  };
  appendToDom(data);
  textarea.value = ''; // Broadcast

  broadcastComment(data); // Sync with Mongo Db

  syncWithDb(data);
}

function appendToDom(data) {
  var lTag = document.createElement('li');
  lTag.classList.add('comment', 'mb-3');
  var markup = "\n                        <div class=\"card border-light mb-3\">\n                            <div class=\"card-body\">\n                                <h6>".concat(data.username, "</h6>\n                                <p>").concat(data.comment, "</p>\n                                <div>\n                                    <img src=\"/img/clock.png\" alt=\"clock\">\n                                    <small>").concat(moment(data.time).format('LT'), "</small>\n                                </div>\n                            </div>\n                        </div>\n    ");
  lTag.innerHTML = markup;
  commentBox.prepend(lTag);
}

function broadcastComment(data) {
  // Socket
  socket.emit('comment', data);
}

socket.on('comment', function (data) {
  appendToDom(data);
});
var timerId = null;

function debounce(func, timer) {
  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(function () {
    func();
  }, timer);
}

var typingDiv = document.querySelector('.typing');
socket.on('typing', function (data) {
  typingDiv.innerText = "".concat(data.username, " is typing...");
  debounce(function () {
    typingDiv.innerText = '';
  }, 1000);
}); // Event listner on textarea

textarea.addEventListener('keyup', function (e) {
  socket.emit('typing', {
    username: username
  });
}); // Api calls 

function syncWithDb(data) {
  var headers = {
    'Content-Type': 'application/json'
  };
  fetch('/api/comments', {
    method: 'Post',
    body: JSON.stringify(data),
    headers: headers
  }).then(function (response) {
    return response.json();
  }).then(function (result) {
    console.log(result);
  });
}

function fetchComments() {
  fetch('/api/comments').then(function (res) {
    return res.json();
  }).then(function (result) {
    result.forEach(function (comment) {
      comment.time = comment.createdAt;
      appendToDom(comment);
    });
  });
}

window.onload = fetchComments;