"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var peerjs_1 = require("peerjs");
var user1Button = document.getElementById('button1');
var user2Button = document.getElementById('button2');
var inputId = document.getElementById('id_input');
var submitId = document.getElementById('id_submit');
var _a = (0, react_1.useState)(0), clicked = _a[0], setClicked = _a[1];
var _b = (0, react_1.useState)(''), sender = _b[0], setSender = _b[1];
user1Button === null || user1Button === void 0 ? void 0 : user1Button.addEventListener('click', function () {
    setClicked(user1Button === null || user1Button === void 0 ? void 0 : user1Button.innerText);
    console.log(clicked);
});
user2Button === null || user2Button === void 0 ? void 0 : user2Button.addEventListener('click', function () {
    setClicked(user2Button === null || user2Button === void 0 ? void 0 : user2Button.innerText);
    console.log(clicked);
});
inputId === null || inputId === void 0 ? void 0 : inputId.addEventListener('change', function () {
    setSender(inputId === null || inputId === void 0 ? void 0 : inputId.innerText);
    console.log(sender);
});
submitId === null || submitId === void 0 ? void 0 : submitId.addEventListener('click', function () {
    var peer = new peerjs_1.default(sender, {
        host: 'localhost',
        port: 9000,
        path: '/myapp'
    });
    peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
    });
});
