"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaComments } from "react-icons/fa";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm ARETE Digital's AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // YOUR GROQ API KEY
     const API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");

    // Add user message to UI
    const newMessages = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Prepare messages for API (skip the initial welcome message)
      const apiMessages = newMessages
        .slice(1) // Skip first welcome message
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      console.log("Sending to API:", apiMessages);

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          
          messages: [
            {
              role: "system",
              content: "You are a helpful AI assistant for ARETE Digital, a premium digital agency that provides website development, SEO, AI chatbots, social media management, branding, and digital transformation services for local businesses. Be friendly, professional, and helpful."
            },
            ...apiMessages
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      
      setIsTyping(false);

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const botReply = data.choices[0].message.content;
        setMessages([...newMessages, { role: "assistant", content: botReply }]);
      } else {
        console.error("Unexpected response format:", data);
        setMessages([
          ...newMessages,
          { role: "assistant", content: "Sorry, I received an unexpected response. Please try again." },
        ]);
      }
    } catch (error: any) {
      setIsTyping(false);
      console.error("Full error:", error);
      
      let errorMessage = "Connection error. ";
      if (error.message.includes("401")) {
        errorMessage += "Invalid API key. Please check your Groq API key.";
      } else if (error.message.includes("429")) {
        errorMessage += "Rate limit exceeded. Please wait a moment and try again.";
      } else if (error.message.includes("Failed to fetch")) {
        errorMessage += "Network error. Please check your internet connection.";
      } else {
        errorMessage += error.message || "Please try again.";
      }
      
      setMessages([
        ...newMessages,
        { role: "assistant", content: errorMessage },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[9998] w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 animate-pulse"
          aria-label="Open chat"
        >
          <FaComments className="text-white text-2xl" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[9999] w-[90vw] max-w-[400px] h-[600px] max-h-[80vh] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
                <img 
                  src="/logo.png" 
                  alt="ARETE Digital Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">ARETE Assistant</h3>
                <p className="text-xs text-white/80">Online • Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-2 transition duration-200"
              aria-label="Minimize chat"
              title="Minimize"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-800 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-br-sm"
                      : "bg-gray-700 text-white rounded-bl-sm shadow-md border border-gray-600"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-gray-700 p-4 rounded-2xl rounded-bl-sm shadow-md border border-gray-600">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-gray-900 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isTyping}
                className="flex-1 px-4 py-3 border-2 border-gray-600 bg-gray-800 text-white rounded-full focus:outline-none focus:border-purple-500 text-sm disabled:bg-gray-700 disabled:cursor-not-allowed placeholder-gray-400"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by Groq AI
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ChatBot;