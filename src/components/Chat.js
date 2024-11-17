import React, { useState, useEffect, useRef } from 'react';
import './styles/Chat.css';
import sendIcon from '../assets/chatbutton.png';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (message.trim()) {
      const newMessages = [...messages, { text: message, sender: 'user' }];
      setMessages(newMessages);
      setMessage('');

      // FastAPI 서버에 메시지 전송
      fetch("http://localhost:8000/api/chatbot/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input_text: message }),
      })
        .then((response) => response.json())
        .then((data) => {
          const botMessage = { text: data.response, sender: 'bot' };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  };

  // 새 메시지가 추가될 때마다 스크롤을 최신 메시지로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="국가유산에 대해 궁금한 건 무엇이든 물어보세요"
        />
        <button onClick={handleSendClick}>
          <img src={sendIcon} alt="전송" className="send-icon" />
        </button>
      </div>
    </div>
  );
}

export default Chat;
