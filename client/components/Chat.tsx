"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Loader2 } from "lucide-react"; // Spinner icon from Lucide

interface Message {
  role: "assistant" | "user" | "loading";
  content: string;
}

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMessageInsert = (role: Message["role"], content: string) => {
    setMessageList((prev) => [...prev, { role, content }]);
  };

  const handleMessageSend = async () => {
    if (!message.trim()) return;

    handleMessageInsert("user", message);
    setMessage(""); // Clear input
    setIsLoading(true);
    handleMessageInsert("loading", "Typing...");

    try {
      const { data } = await axios.get(process.env.BACKEND_URL + "/chat", {
        params: { message },
      });

      // Replace loader with actual assistant message
      setMessageList((prev) => [
        ...prev.filter((msg) => msg.role !== "loading"),
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessageList((prev) => prev.filter((msg) => msg.role !== "loading"));
      handleMessageInsert(
        "assistant",
        "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-dvh bg-gray-50">
      {/* Chat area */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messageList.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap shadow ${
              msg.role === "user"
                ? "bg-blue-600 text-white self-end ml-auto"
                : msg.role === "assistant"
                ? "bg-gray-200 text-gray-800 self-start mr-auto"
                : "bg-gray-100 text-gray-500 italic self-start mr-auto"
            }`}
          >
            {msg.role === "loading" ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{msg.content}</span>
              </div>
            ) : (
              msg.content
            )}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="w-full px-4 py-3 border-t bg-white flex gap-2 items-center">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleMessageSend()}
          className="flex-1"
          disabled={isLoading}
        />
        <Button onClick={handleMessageSend} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default Chat;
