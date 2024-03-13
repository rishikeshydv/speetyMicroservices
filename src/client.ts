import React, { useState } from 'react';
import Peer from 'peerjs';

const user1Button = document.getElementById('button1');
const user2Button = document.getElementById('button2');
const inputId= document.getElementById('id_input');
const submitId = document.getElementById('id_submit');

const [clicked, setClicked] = useState('');
const [sender, setSender] = useState('');

user1Button?.addEventListener('click', () => {
  setClicked(user1Button?.innerText);
  console.log(clicked);
});
user2Button?.addEventListener('click', () => {
  setClicked(user2Button?.innerText);
  console.log(clicked);
});
inputId?.addEventListener('change', () => {
  setSender(inputId?.innerText);
  console.log(sender);
});

submitId?.addEventListener('click', () => {
  const peer = new Peer(sender,{
    host: 'localhost',
    port: 9000,
    path: '/myapp'
  
  });
  peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
  });
});




