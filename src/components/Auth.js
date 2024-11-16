import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import './styles/Auth.css';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // useNavigate 사용

  const isFormValid = email.trim() !== '' && password.length >= 5; // 이메일이 비어있지 않고, 비밀번호가 5자 이상인 경우

  const handleAuthToggle = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:8000/token"
      : "http://localhost:8000/register";

    const data = isLogin
      ? new URLSearchParams({ username: email, password: password })
      : { username: name, email, password };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": isLogin ? "application/x-www-form-urlencoded" : "application/json"
      },
      body: isLogin ? data : JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(isLogin ? '로그인 실패. 이메일과 비밀번호를 확인하세요.' : '회원가입에 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        if (isLogin) {
          localStorage.setItem('token', data.access_token);
          navigate("/profile"); // 로그인 성공 시 프로필 페이지로 이동
        } else {
          setSuccess("회원가입이 완료되었습니다. 로그인 해주세요.");
          setIsLogin(true);
          setName('');
          setEmail('');
          setPassword('');
        }
      })
      .catch((error) => setError(error.message));
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? "백문불여일견 로그인" : "백문불여일견 회원가입"}</h1>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={!isFormValid} // 버튼 비활성화 조건 추가
          className={isFormValid ? "active" : "inactive"} // 클래스 변경
        >
          {isLogin ? "로그인" : "회원가입"}
        </button>
      </form>
      <button className="toggle-button" onClick={handleAuthToggle}>
        {isLogin ? "회원가입으로 이동" : "로그인으로 이동"}
      </button>
    </div>
  );
}

export default Auth;
