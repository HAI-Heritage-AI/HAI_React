import React, { useState } from 'react';
import './styles/Chat.css';
import sendIcon from '../assets/chatbutton.png';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (message.trim()) {
      const newMessages = [...messages, { text: message, sender: 'user' }];
      setMessages(newMessages);
      setMessage('');

      // FastAPI 서버에 메시지 전송
      fetch("http://localhost:8000/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input_text: message }),  // JSON 형식으로 감싸서 전송
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

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
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
