"use client";
import dotenv from 'dotenv';
import React, { useEffect } from "react";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { useRouter } from 'next/router';
import { uuid } from 'uuidv4';

export default async function Video() {
  dotenv.config(); 
  const zg = new ZegoExpressEngine(
    Number(process.env.ZEGO_APPID),
    process.env.ZEGO_SERVERSECRET as string
  );
  const _roomId = uuid();

  await zg.loginRoom(
    _roomId,
    "token",
    { userID: "123", userName: "Rishi" },
    { userUpdate: true }
  );
  useEffect(() => {
    const initializeApp = async () => {
      const zg = new ZegoExpressEngine(
        Number(process.env.ZEGO_APPID),
        process.env.ZEGO_SERVERSECRET as string
      );
//here we will be retrieving the roomId from the params of the url
//make sure you do router.push(`/video/${user?.email+brokerName}}`)
//while clicking on the video-call icon

      // const router = useRouter();
      // const _email = router.query.email as string; 
      // const _brokerName = router.query.brokerName as string; 
      // const _roomId = _email+_brokerName;

      zg.on(
        "roomStreamUpdate",
        async (roomID, updateType, streamList, extendedData) => {
          if (updateType === "ADD") {
            const rmVideo = document.getElementById("remote-video");
            const vd = document.createElement("video");
            vd.id = streamList[0].streamID;
            vd.autoplay = true;
            vd.playsInline = true;
            vd.muted = false;
            if (rmVideo) {
              rmVideo.appendChild(vd);
            }
            zg.startPlayingStream(streamList[0].streamID, {
              audio: true,
              video: true,
            }).then((stream) => {
              vd.srcObject = stream;
            });
          } else if (updateType === "DELETE" && zg && streamList[0].streamID) {
            zg.stopPlayingStream(streamList[0].streamID); // Fixed method name
            zg.logoutRoom("zego-room"); // Changed hard-coded roomID to "zego-room"
          }
        }
      );

      await zg.loginRoom(
        "zego-room",
        "token",
        { userID: "123", userName: "Rishi" },
        { userUpdate: true }
      );

      const localStream = await zg.createStream({
        camera: {
          audio: true,
          video: true,
        },
      });

      const localAudio = document.getElementById("local-video");

      const videoElement = document.createElement("video");
      videoElement.id = "local-video";
      videoElement.className = "h-28 w-32";
      videoElement.autoplay = true;
      videoElement.muted = false;

      videoElement.playsInline = true;
      
      localAudio?.appendChild(videoElement);
      videoElement.srcObject = localStream;

      const streamID = "123" + Date.now();
      zg.startPublishingStream(streamID, localStream);
    };

    initializeApp(); // Call the initialization function

    // Clean up function
    return () => {
      // Perform any cleanup, e.g., disconnect from Zego
    };
  }, []); // Dependency array is empty, effect runs only once

  return (
    <div>
      <div id="local-video"></div>
      <div id="remote-video"></div>
    </div>
  );
}
