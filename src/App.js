import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ChatMenu from './components/ChatMenu';
import Chat from './components/Chat';
import Book from './components/Book';
import Trips from './components/Trips';
import Profile from './components/Profile';
import HeritageDetail from './components/HeritageDetail'; 
import BottomNavigation from './components/BottomNavigation';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

function AppContent() {
  const location = useLocation(); // 현재 경로 가져옴
  const [activeMenu, setActiveMenu] = useState('');

  useEffect(() => {
    // 현재 경로에 따라 활성화된 메뉴 상태 설정
    if (location.pathname === '/') {
      setActiveMenu('chat');
    } else if (location.pathname.includes('/book')) {
      setActiveMenu('book');
    } else if (location.pathname.includes('/trips')) {
      setActiveMenu('trips');
    } else if (location.pathname.includes('/profile')) {
      setActiveMenu('profile');
    } else if (location.pathname.includes('/heritage')) {
      setActiveMenu('book'); // HeritageDetail에서도 book 활성화
    }
  }, [location.pathname]);

  return (
    <>
      {location.pathname === '/' && (
        <>
          <Header />
          <ChatMenu />
        </>
      )}
      <Routes>
        <Route path="/" element={<Chat />} />  
        <Route path="/book" element={<Book />} />  
        <Route path="/trips" element={<Trips />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/heritage/:id" element={<HeritageDetail />} /> {/* 상세 페이지 경로 추가 */}
      </Routes>
      <BottomNavigation activeMenu={activeMenu} /> {/* 활성화된 메뉴 상태 전달 */}
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

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
