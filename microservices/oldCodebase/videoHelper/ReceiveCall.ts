import React, { useEffect } from "react";
import { auth } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

export default function ReceiveCall() {
  useEffect(() => {
    import("peerjs").then(({ default: Peer }) => {
      const receiverVideo = document.getElementById(
        "receiver"
      ) as HTMLVideoElement;
      var getUserMedia = navigator.mediaDevices.getUserMedia;
      const [user] = useAuthState(auth);
      if (user) {
        //this is the sender call id
        const _email = user.email as string;
        var peer = new Peer(_email);
        peer.on("call", function (call) {
          getUserMedia({ video: true, audio: true }).then(
            (stream: MediaStream) => {
              call.answer(stream);
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
      }
    });
  }, []);
}
