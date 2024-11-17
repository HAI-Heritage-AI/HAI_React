import React, { useState, useEffect } from 'react';
import './styles/Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch("http://localhost:8000/api/auth/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch profile");
          }
          return response.json();
        })
        .then((data) => setUser(data))
        .catch((error) => {
          console.error("Error:", error);
          setError("로그인이 필요합니다.");
          localStorage.removeItem('token');
          window.location.href = "/auth";
        });
    } else {
      window.location.href = "/auth";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = "/auth";
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!user) {
    return <p className="loading-message"></p>;
  }

  return (
    <div className="profile-container">
      {/* <h1>Profile</h1> */}
      <div className="profile-card">
        <img src={user.profilePicture || "https://via.placeholder.com/150"} alt="프로필 사진" />
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>
      <button onClick={handleLogout} className="logout-button">로그아웃</button>
    </div>
  );
}

export default Profile;
