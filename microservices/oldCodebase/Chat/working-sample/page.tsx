"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import Peer from "peerjs"

export default function Chat() {
  const [user] = useAuthState(auth);

  const [id, setId] = useState<string>("");
  const [friendId, setFriendId] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [clicked, setClicked] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [myPeer, setMyPeer] = useState<Peer | null>(null);
  const [connection, setConnection] = useState({});


  function userOnClick(clickedUser: string) {
    setClicked(clickedUser);
  }

  function friendFunc(event: any) {
    setFriendId(event.target.value);
  }

  function myFunc(event: any) {
    setId(event.target.value);
  }

  function messageFunc(event: any) {
    setMessage(event.target.value);
  }

  const send = () => {
    const conn = myPeer?.connect(friendId);

    conn?.on('open', () => {

      const msgObj = {
        sender: id,
        message: message
      };

      conn.send(msgObj);
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessage('')

    })}
    
  useEffect(() => {
    if (!myPeer){
        const peer = new Peer(id, {
            host: "localhost",
            port: 9000,
            path: "/myapp",
          });
      
          peer.on('open', (id ) => {
            setMyPeer(peer);
            setId(id);
          });
      
          peer.on('connection', (conn) => {
            conn.on('data', (data:any) => {
              setMessages((prevMessages) => [...prevMessages, data.message]);
            });
          });
    }
    return () => {
        if (myPeer) {
            myPeer.destroy();
            setMyPeer(null);
        }
    };
    }
    , [myPeer]);
    
//}, [myPeer, friendId, id, message]);

  return (
    <div>
        <div className="bg-gray-100">
      <div id="text-area">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <textarea
        id="message-input"
        className="bg-blue-100"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      ></textarea>
      <button type="submit" id="send-button">
        Submit
      </button>
      <div className="flex flex-col">
        <button
          id="button1"
          value={"heroine@heroine.com"}
          className="bg-red-400"
          onClick={myFunc}
        >
          heroine@heroine.com
        </button>
        <button
          id="button1"
          value={"test@test.com"}
          className="bg-red-400"
          onClick={myFunc}
        >
          test@test.com
        </button>


        <button
          id="button2"
          value={"heroine@heroine.com"}
          className="bg-green-400 mt-4"
          onClick={friendFunc}
        >
         heroine@heroine.com
        </button>

        <button
          id="button2"
          value={"test@test.com"}
          className="bg-green-400 mt-4"
          onClick={friendFunc}
        >
          test@test.com
        </button>

      </div>
      <div
        id="big-rectangle"
        style={{ width: "200px", height: "200px", border: "1px solid black" }}
      ></div>
    </div>







    <div className="wrapper">
    <div className="col">
    <label> My ID:</label>
    <input
        type="text"
        value={id}
        onChange={myFunc}/>

      <label>Friend ID:</label>
      <input
        type="text"
        value={friendId}
        onChange={friendFunc}/>

      <br />
      <br />

      <label>Message:</label>
      <input
        type="text"
        value={message}
        onChange={messageFunc} />
      <button onClick={send}>Send</button>
      {
        messages.map((message, i) => {
          return (
            <div key={i}>
              <p>{message}</p>
            </div>

          )
        })
      }
    </div>

  </div>
  </div>
  );
}
