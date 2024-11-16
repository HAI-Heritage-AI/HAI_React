import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ChatMenu from './components/ChatMenu';
import Chat from './components/Chat';
import Book from './components/Book';
import Trips from './components/Trips';
import Profile from './components/Profile';
import HeritageDetail from './components/HeritageDetail';
import BottomNavigation from './components/BottomNavigation';
import LoadingScreen from './components/LoadingScreen';
import TripResult from './components/TripResult';
import Auth from './components/Auth'; // Auth 컴포넌트 추가
import './App.css';

function AppContent() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('');

  useEffect(() => {
    if (location.pathname === '/') {
      setActiveMenu('chat');
    } else if (location.pathname.includes('/book')) {
      setActiveMenu('book');
    } else if (location.pathname.includes('/trips') || location.pathname.includes('/trip-result')) {
      setActiveMenu('trips');
    } else if (location.pathname.includes('/auth') || location.pathname.includes('/profile')) {
      setActiveMenu('profile');
    } else if (location.pathname.includes('/heritage')) {
      setActiveMenu('book');
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
        <Route path="/auth" element={<Auth />} /> {/* 로그인/회원가입 라우트 추가 */}
        <Route path="/book" element={<Book />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> {/* PrivateRoute로 Profile 보호 */}
        <Route path="/heritage/:id" element={<HeritageDetail />} />
        <Route path="/trip-result" element={<TripResult />} />
      </Routes>
      <BottomNavigation activeMenu={activeMenu} />
    </>
  );
}

// PrivateRoute 컴포넌트: 로그인되지 않은 사용자를 리다이렉트
function PrivateRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('token'); // 토큰 존재 여부로 인증 상태 확인

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />; // 로그인되지 않은 경우 /auth로 리다이렉트
  }

  return children;
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
