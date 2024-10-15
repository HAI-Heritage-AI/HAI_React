import React, { useState } from 'react';
import './styles/ChatMenu.css';

function ChatMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* 햄버거 메뉴 버튼 */}
      <div className="hamburger-menu" onClick={toggleMenu}>
        ☰
      </div>

      {/* 메뉴가 열리면 보여주는 오버레이 */}
      {isMenuOpen && (
        <div className="menu-overlay">
          <div className="menu-header">
            <h3>지난 채팅 기록</h3>
            <button className="close-btn" onClick={toggleMenu}>
              닫기
            </button>
          </div>

          <div className="chat-history">
            <ul>
              <li>불국사 - 경주</li>
              <li>창덕궁 - 서울</li>
              <li>석굴암 - 경주</li>
              {/* 더 많은 채팅 기록 추가 가능 */}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatMenu;
