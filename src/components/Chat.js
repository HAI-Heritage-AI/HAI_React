import React, { useState } from 'react';
import './styles/Chat.css'; // 기존 스타일 파일 불러오기
import sendIcon from '../assets/chatbutton.png'; // 아이콘 불러오기

function Chat() {
  // 메시지 상태 관리 (사용자 메시지와 챗봇 메시지를 배열로 저장)
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  // 입력 변화 처리
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  // 전송 클릭 처리
  const handleSendClick = () => {
    if (message.trim()) {
      // 사용자 메시지를 추가
      const newMessages = [...messages, { text: message, sender: 'user' }];

      // 챗봇 응답 추가 (임의의 응답)
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: '챗봇 응답: ' + message, sender: 'bot' },
        ]);
      }, 1000); // 1초 후에 챗봇 응답

      // 메시지 상태 업데이트
      setMessages(newMessages);
      setMessage(''); // 입력창 초기화
    }
  };

  // 엔터키 감지 및 전송
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendClick();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {/* 메시지 출력 */}
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
          onKeyPress={handleKeyPress}  // 엔터키 이벤트 추가
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