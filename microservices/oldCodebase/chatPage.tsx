"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  Timestamp,
  where,
  getDocs,
} from "firebase/firestore";
import Message from "@/components/Message";
import SendMessage from "@/components/SendMessage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase/config";
import { useRouter } from 'next/router';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface MessageData {
  uid: string;
  text: string;
  name: string;
  createdAt: Timestamp;
}
const ChatBox = () => {
  const [user] = useAuthState(auth);
  const email = user?.email;
  const [messages, setMessages] = useState<MessageData[]>([]);
  const scroll = useRef<HTMLSpanElement>(null!);

const router = useRouter();
const _email = router.query.email as string; 
const _brokerName = router.query.brokerName as string; 
const _roomId = _email+_brokerName;

  useEffect(() => {
    const roomId = _roomId;
    const docRef = collection(db, "messages");
    const q = query(docRef, where("roomId", "==", roomId));
    getDocs(q).then((docSnap) => {
      const fetchedMessages: MessageData[] = [];
      docSnap.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), uid: doc.id } as MessageData);
        const sortedMessages = fetchedMessages.sort(
          (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
        );
        setMessages(sortedMessages);
      });
    });
  }, []);

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <main className="chat-box">
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message key={message.uid} message={message} />
        ))}
      </div>
      {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
      <span ref={scroll}></span>
      <SendMessage scroll={scroll} />

      <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>One</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            {/* Here, we will be using nested form */}
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel>One</ResizablePanel>
              <ResizableHandle />
              <ResizablePanel>Two</ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </main>
  );
};

export default ChatBox;
