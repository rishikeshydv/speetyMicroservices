import React, { useEffect } from "react";
import { auth } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

export default function StartCall() {
    useEffect(() => {
      import("peerjs").then(({ default: Peer }) => {
        //this is a function to start a call
          const [user] = useAuthState(auth);
          if (user) {
            //this is the sender call id
            const _email = user.email as string;
            var peer = new Peer(_email);
  
            const router = useRouter();
            const receiverEmail = router.query.email as string;
  
            const callerVideo = document.getElementById(
              "caller"
            ) as HTMLVideoElement;
  
            var getUserMedia = navigator.mediaDevices.getUserMedia;
            getUserMedia({ video: true, audio: true })
              .then((stream: MediaStream) => {
                var call = peer.call(receiverEmail, stream); //stream is the video/audio of callerUser
                call.on("stream", function (remoteStream: MediaStream) {
                  //remoteStream is the video/audio of receiverUser
                  callerVideo.srcObject = stream;
                  try {
                    callerVideo.play();
                  } catch (error) {
                    console.log("Error playing the caller video", error);
                  }
                });
              })
              .catch((err) => {
                console.log("Error Occurred!");
              });
          }
    });
}, []);
}