"use client";

import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, addDoc, getDocs, where, query } from "firebase/firestore";
import { db } from "@/firebase/config";

//imports for location
import GetLatLng from "@/services/location/addressConverter";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Locator } from "@/services/location/currentLocation";

interface User {
  id: string;
  name: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
}

interface userLoc {
  email: string;
  location: [number, number];
}

interface LocationData {
  lat: number;
  lng: number;
}

interface MessageData {
  message: string;
}
export default function Chat() {
  const [user] = useAuthState(auth);
  var [userList, setUserList] = useState([]);
  //clicked is used to store the receiverEmail
  var [clicked, setClicked] = useState("");

  //initializing the google map api with the API key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY as string,
  });

  //setting the destination location
  var [address, setAddress] = useState<string>("");
  //this handles the change in entered destination address
  //and sets it to destination_
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(event.target.value);
  };

  const [latt, long] = GetLatLng({ address });
  const center = { lat: latt, lng: long };

  //retrieving user1's location uponChange
  const [position1, setPosition1] = useState({ lat: 0, lng: 0 });
  const [position2, setPosition2] = useState({ lat: 0, lng: 0 });

  //the function below returns a list to which userEmail is connected to
  //this is stored in the "connectedHistory" collection of firebase
  //we will be using it to build the left UI of the chatroom

  //gets me a list of users on the left side of the app
  useEffect(() => {
    async function getConnectedUsers() {
      if (user) {
        const connectionEstablishedQuery = query(
          collection(db, "connectedHistory"),
          where("senderEmail", "==", user.email)
        );
        const connectionEstablishedSnapshot = await getDocs(
          connectionEstablishedQuery
        );
        connectionEstablishedSnapshot.forEach((doc) => {
          setUserList(doc.data().connectedEmails);
        });
      }
    }
    getConnectedUsers();
  }, [user]);

  console.log(userList);
  //upon clicking the users in the left, we set the value of 'clicked'
  function userOnClick(clickedUser: string) {
    setClicked(clickedUser);
  }

  //we will be sending and receiving messages now
  useEffect(() => {
    const messageInput = document.getElementById(
      "message-input"
    ) as HTMLTextAreaElement;
    const sendButton = document.getElementById(
      "send-button"
    ) as HTMLButtonElement;

    import("peerjs").then(({ default: Peer }) => {
      //creating peer of the sender user
      var peer = new Peer(user?.email as string);
      //making connection with the receiver user email
      var conn = peer.connect(clicked);

      //TODO: Chat App Start
      peer.on("connection", (conn) => {
        console.log("Connected to: " + conn.peer);

        //sending the message to the receiver peer upon clicking on the send button
        sendButton.addEventListener("click", () => {
          const message = messageInput.value;
          conn.send(message);
          displayMessage(message);
          messageInput.value = ""; // Clear the input box
        });

        conn.on("data", (data: any) => {
          if (data === null) {
            console.log("Nothing reeived on Receiver End");
            return;
          }
          // Handle location data
          if (typeof data === "string") {
            displayMessage(data);
            return;
          }

          if (
            typeof data === "object" &&
            data.hasOwnProperty("lat") &&
            data.hasOwnProperty("lng") &&
            typeof data.lat === "number" &&
            typeof data.lng === "number"
          ) {
            setPosition2({ lat: data.lat, lng: data.lng });
            return;
          }
        });

        function displayMessage(message: string) {
          const messagesDiv = document.getElementById(
            "text-area"
          ) as HTMLElement;
          const messageParagraph = document.createElement("p");
          messageParagraph.textContent = message;
          messagesDiv.appendChild(messageParagraph);
        }

        //TODO: Chat App End

        //TODO: Video Call App Start
        //here, we will check if we have any incoming calls
        var getUserMedia = navigator.mediaDevices.getUserMedia;
        //grabs the frame onto which the receiver video will be shown
        const receiverVideo = document.getElementById(
          "receiver"
        ) as HTMLVideoElement;
        peer.on("call", function (call) {
          getUserMedia({ video: true, audio: true }).then(
            (stream: MediaStream) => {
              call.answer(stream);

              //TODO: DATABASE LOGIC

              //write a logic to store the call into the database and its status of ACCEPT/REJECT
              //this should be restored in the chat history

              call.on("stream", function (remoteStream) {
                // Show stream in some video/canvas element.
                receiverVideo.srcObject = stream;
                try {
                  receiverVideo.play();
                } catch (error) {
                  console.log("Error playing the caller video", error);
                }
              });
            }
          );
        });

        //here, we will be sending call to different peers
        //the react functional component below accesses the caller video and send the
        //stream to the receiver
        //it returns a html component which means you get an UI as well
        function videoOnClick() {
          console.log("Video Call Started");
          //accessing the video frame of the calling user
          const callerVideo = document.getElementById(
            "caller"
          ) as HTMLVideoElement;

          //adding the event listener for the user who starts the call
          var getUserMedia = navigator.mediaDevices.getUserMedia;
          getUserMedia({ video: true, audio: true })
            .then((stream: MediaStream) => {
              var call = peer.call(clicked, stream); //stream is the video/audio of callerUser
              call.on("stream", function (remoteStream: MediaStream) {
                //remoteStream is the video/audio of receiverUser
                callerVideo.srcObject = stream;
                try {
                  callerVideo.play();
                } catch (error) {
                  console.log("Error playing the caller video", error);
                }
              });
              call.on("error", (error) => {
                console.log("Error occurred during call:", error);
              });
            })
            .catch((err) => {
              console.log("Error Occurred during getUserMedia");
            });

          //TODO: Video Call App End

          //TODO: DATABASE LOGIC

          //write a logic to store the call into the database and its status of ACCEPT/REJECT
          //this should be restored in the chat history
        }

        //TODO: Location Sharing Start once the form is submitted
        function locationOnClick(event: Event) {
          // Prevent the default form submission behavior
          event.preventDefault();

          //on clicking the location share button, there should be a popup
          // Send location when obtained
          if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function (position) {
              setPosition1({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
              conn.send(location);
            });
          } else {
            console.log("Geolocation is not supported by this browser.");
          }
        }

        //here, we access the video call icon and add an OnClickEventListener
        const VideoCall = document.getElementById(
          "start-call"
        ) as HTMLButtonElement;
        VideoCall.addEventListener("click", videoOnClick);

        //here we will handle the event after the form is submitted
        //after clicking on the 'submit' button
        const LocationShare = document.getElementById(
          "locationForm"
        ) as HTMLFormElement;
        LocationShare.onsubmit = locationOnClick;
      });
    });
  }, [clicked, user]);

  return (
    <div className="chat-container">
      <div className="w-screen h-screen">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>UserLists</ResizablePanel>

          {/* Video & Location Start */}

      {/* 
Here we will be temporarily adding the sender and receiver videos
I really need to find a way to pop up a screen to accept/reject the call, store the history of calls
*/}
      <div>
        <video id="caller"></video>
        <video id="receiver"></video>
      </div>

      <div id="map">
        {/* Map will be added here */}
        {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          <GoogleMap
            mapContainerClassName="map-container"
            center={center}
            zoom={10}
          >
            {/* This would be the marker of user1 */}
            <Marker position={{ lat: position1.lat, lng: position1.lat }} />
            <Marker position={{ lat: position2.lat, lng: position2.lat }} />
          </GoogleMap>
        )}
      </div>

          {/* Video& Location End */}

          <div className="connected-users">
            {/* Here we will be adding all the users inside this class "connected-users" */}
            <ul className="flex flex-row justify-center">
              {userList.map((email) => (
                <button key={email} onClick={() => userOnClick(email)}>
                  <li>{email}</li>
                </button>
              ))}
            </ul>
          </div>
          <ResizableHandle />
          <ResizablePanel>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel>
                <div
                  className="flex flex-row justify-between"
                  onClick={() => {}}
                >
                  {/* this is the avatar ui for video call */}
                  <button id="start-video">
                    <Avatar>
                      <AvatarImage src="/video-call.png" />
                      <AvatarFallback>Video</AvatarFallback>
                    </Avatar>
                  </button>
                  {/* this is the avatar ui for location call */}
                  <button id="start-location">
                    <Popover>
                      <PopoverTrigger>
                        <Avatar>
                          <AvatarImage src="/locate.png" />
                          <AvatarFallback>Location</AvatarFallback>
                        </Avatar>
                      </PopoverTrigger>
                      <PopoverContent>
                        <form id="locationForm">
                          <label htmlFor="userInput">Enter Text:</label>
                          <br />
                          <textarea
                            id="userInput"
                            name="userInput"
                            className="border"
                            value={address}
                            onChange={handleChange}
                          />
                          <br />
                          <button type="submit" className="border">
                            Submit
                          </button>
                        </form>
                      </PopoverContent>
                    </Popover>
                  </button>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel>
                <div className="chat-messages">
                  <h2>Chat Messages</h2>
                  <div id="text-area"></div>
                  <div>
                    <textarea
                      id="message-input"
                      className="rows-4 cols-50"
                      placeholder="Enter text..."
                    />
                    <button id="send-button">Send</button>
                    <ul></ul>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
