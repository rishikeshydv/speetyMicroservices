"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, addDoc, getDocs, where, query } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function Chat() {
  const [user] = useAuthState(auth);
  var [clicked, setClicked] = useState("");
  var [messages, setMessages] = useState<string[]>([]); // New state variable for messages
  var [inputValue, setInputValue] = useState(""); // New state variable for input box value

  function userOnClick(clickedUser: string) {
    setClicked(clickedUser);
  }
  useEffect(() => {
    import("peerjs").then(({ default: Peer }) => {
      var peer = new Peer(user?.email as string);
      console.log("Peer Created " + user?.email);

      peer.on("connection", (conn) => {
        console.log("Connected to: " + conn.peer);

        conn.on("data", (data: any) => {
          if (data === null) {
            console.log("Nothing reeived on Receiver End");
            return;
          }
          if (typeof data === "string") {
            setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
            return;
          }
        });
      });

      // If a user is clicked, connect to them
      if (clicked) {
        var conn = peer.connect(clicked);
        console.log("Connected to: " + clicked);

        const sendButton = document.getElementById(
          "send-button"
        ) as HTMLButtonElement;
        sendButton.addEventListener("click", () => {
          const message = inputValue;
          conn.send(message);
          setMessages((prevMessages) => [...prevMessages, message]); // Update messages state
          setInputValue(""); // Clear the input box
          console.log("Sent: " + message);
        });
      }
    });
  }, [clicked, user, inputValue]);

  return (
    <div className="bg-gray-100">
      <div id="text-area">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}{" "}
        {/* Display messages */}
      </div>
      <textarea
        id="message-input"
        className="bg-blue-100"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      ></textarea>{" "}
      {/* Bind input box value to state */}
      <button type="submit" id="send-button">
        Submit
      </button>{" "}
      {/* Call sendMessage when button is clicked */}
      <div className="flex flex-col">
        <button
          id="button1"
          value={"rishikeshadh4@gmail.com"}
          className="bg-red-400"
          onClick={() => {
            userOnClick("rishikeshadh4@gmail.com");
          }}
        >
          rishikeshadh4@gmail.com
        </button>
        <button
          id="button2"
          value={"newuser@gmail.com"}
          className="bg-green-400 mt-4"
          onClick={() => {
            userOnClick("newuser@gmail.com");
          }}
        >
          newuser@gmail.com
        </button>
      </div>
      <div
        id="big-rectangle"
        style={{ width: "200px", height: "200px", border: "1px solid black" }}
      ></div>
    </div>
  );
}