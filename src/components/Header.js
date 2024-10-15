import React from 'react';
import './styles/Header.css';

function Header() {
  return (
    <header className="header">
      {/* 햄버거 메뉴만 남기고 Chat 단어는 제거 */}
      <div className="hamburger-menu">
        ☰
      </div>
    </header>
  );
}

export default Header;
