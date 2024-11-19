import React, { useState, useEffect, useRef } from "react";
import "./styles/ChatBox.css";

const ChatBox = ({ tripData }) => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatBoxRef = useRef(null);

  // useEffect를 사용하여 컴포넌트가 마운트될 때 tripData 출력
  useEffect(() => {
    console.log("Received tripData:", tripData);
  }, [tripData]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const userMessage = { sender: "user", text: message };
    setChatHistory((prev) => [...prev, userMessage]);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat/chatagent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: message,
          context: JSON.stringify(tripData), // 여행 계획 데이터를 JSON 문자열로 변환하여 전달
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage = { sender: "bot", text: data.answer };
        setChatHistory((prev) => [...prev, botMessage]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          { sender: "bot", text: "에이전트와 연결할 수 없습니다." },
        ]);
      }
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: "에이전트 연결 중 오류가 발생했습니다." },
      ]);
    }
  
    setMessage("");
  };  

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="chatbox-container">
      <div className="chatbox-messages" ref={chatBoxRef}>
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`chat-message ${chat.sender === "user" ? "user" : "bot"}`}
          >
            {chat.text}
          </div>
        ))}
      </div>
      <div className="chatbox-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="여행 에이전트에게 무엇이든 물어보세요"
        />
        <button onClick={handleSendMessage}>보내기</button>
      </div>
    </div>
  );
};

export default ChatBox;
