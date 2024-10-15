import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ChatMenu from './components/ChatMenu';  // ChatMenu 추가
import Chat from './components/Chat';
import Book from './components/Book';  // Book 페이지 추가
import Trips from './components/Trips'; // Trips 페이지 추가
import Profile from './components/Profile'; // Profile 페이지 추가
import BottomNavigation from './components/BottomNavigation';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function AppContent() {
  const location = useLocation(); // 현재 경로 가져옴

  return (
    <>
      {/* Chat 페이지(/)일 때만 Header(햄버거 메뉴)와 ChatMenu가 보이도록 설정 */}
      {location.pathname === '/' && (
        <>
          <Header />
          <ChatMenu />
        </>
      )}
      <Routes>
        <Route path="/" element={<Chat />} />  {/* 기본 경로 Chat 페이지 */}
        <Route path="/book" element={<Book />} />  {/* Book 페이지 */}
        <Route path="/trips" element={<Trips />} /> {/* Trips 페이지 */}
        <Route path="/profile" element={<Profile />} /> {/* Profile 페이지 */}
      </Routes>
      <BottomNavigation /> {/* 하단 네비게이션 */}
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 로딩 시간 설정

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {loading ? <LoadingScreen /> : (
        <Router>
          <AppContent />
        </Router>
      )}
    </div>
  );
}

export default App;
