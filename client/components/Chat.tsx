"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<Message[]>([]);

  const handleMessageInsert = (role: "assistant" | "user", content: string) => {
    setMessageList((prev) => [...prev, { role, content }]);
    setMessage(""); // Clear input after sending
  };

  const handleMessageSend = async () => {
    if (!message.trim()) return;
    handleMessageInsert("user", message);
    try {
      const { data } = await axios.get("http://localhost:8000/chat", {
        params: { message },
      });
      handleMessageInsert("assistant", data.message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-gray-50">
      {/* Messages display area */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messageList.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[75%] p-3 rounded-xl text-sm whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-blue-600 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-800 self-start mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="w-full px-4 py-3 border-t bg-white flex gap-2 items-center">
        <Input
          placeholder="Enter your question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleMessageSend}>Send</Button>
      </div>
    </div>
  );
};

export default Chat;
