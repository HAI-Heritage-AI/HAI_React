import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles/Trip.css';

function Trips() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    companion: '',
    destination: '',
    style: '',
    startDate: '',
    endDate: '',
  });
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [customDestination, setCustomDestination] = useState('');
  const [customStyle, setCustomStyle] = useState('');

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setStep(step + 1);
  };

  const handleDateChange = (date) => {
    setSelectedDates(date);
    setFormData({
      ...formData,
      startDate: date[0].toLocaleDateString('ko-KR'),
      endDate: date[1] ? date[1].toLocaleDateString('ko-KR') : '',
    });
  };

  // 여행 계획 생성 함수 - POST 요청 대신 바로 이동
  const handleCreateTrip = useCallback(async () => {
    try {
      // 서버가 없는 상황에서 바로 결과 페이지로 이동합니다.
      navigate('/trip-result');
      
      // 실제 API 요청이 필요할 때 사용합니다.
      /*
      const response = await fetch('/api/create-travel-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate('/trip-result');
      } else {
        console.error('여행 계획 생성 실패');
      }
      */
    } catch (error) {
      console.error('API 호출 에러:', error);
    }
  }, [navigate]);
  // [formData, navigate]);

  // 여행 일정 선택 후 자동으로 계획 생성
  useEffect(() => {
    if (step === 6 && formData.startDate && formData.endDate) {
      handleCreateTrip();
    }
  }, [step, formData.startDate, formData.endDate, handleCreateTrip]);

  const progressWidth = `${(step / 6) * 100}%`;

  return (
    <div className="trip-container">
      <div className="header">
        <span className="back-button" onClick={() => step > 1 && setStep(step - 1)}>&larr;</span>
        <div className="progress-container">
          <div className="step-indicator">
            <div className="step-progress" style={{ width: progressWidth }}></div>
          </div>
        </div>
      </div>

      <div className="step-text">{step}/6</div>

      {step === 1 && (
        <div className="trip-radio-group">
          <h2 className="trip-subheader">성별이 어떻게 되세요?</h2>
          <button className="trip-radio-button" onClick={() => handleInputChange('gender', 'female')}>여성</button>
          <button className="trip-radio-button" onClick={() => handleInputChange('gender', 'male')}>남성</button>
          <button className="trip-radio-button" onClick={() => handleInputChange('gender', 'none')}>선택안함</button>
        </div>
      )}

      {step === 2 && (
        <div className="trip-radio-group">
          <h2 className="trip-subheader">연령이 어떻게 되세요?</h2>
          {['10대', '20대', '30대', '40대', '50대', '60대 이상'].map(age => (
            <button key={age} className="trip-radio-button" onClick={() => handleInputChange('age', age)}>{age}</button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="trip-radio-group">
          <h2 className="trip-subheader">누구와 함께 가실건가요?</h2>
          {['혼자', '연인', '친구', '부모님', '아이', '기타'].map(companion => (
            <button key={companion} className="trip-radio-button" onClick={() => handleInputChange('companion', companion)}>{companion}</button>
          ))}
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="trip-subheader">어디로 여행을 가실건가요?</h2>
          <div className="trip-radio-grid">
            {['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '세종', '제주'].map(destination => (
              <button key={destination} className="trip-radio-button" onClick={() => handleInputChange('destination', destination)}>{destination}</button>
            ))}
            <input
              type="text"
              className="custom-input"
              placeholder="직접 입력"
              value={customDestination}
              onChange={(e) => setCustomDestination(e.target.value)}
              onBlur={() => handleInputChange('destination', customDestination)}
            />
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="trip-radio-group">
          <h2 className="trip-subheader">여행 스타일이 어떻게 되세요?</h2>
          {['국가유산', '휴양', '액티비티', '식도락', '쇼핑', 'SNS감성'].map(style => (
            <button key={style} className="trip-radio-button" onClick={() => handleInputChange('style', style)}>{style}</button>
          ))}
          <input
            type="text"
            className="custom-input"
            placeholder="직접 입력"
            value={customStyle}
            onChange={(e) => setCustomStyle(e.target.value)}
            onBlur={() => handleInputChange('style', customStyle)}
          />
        </div>
      )}

      {step === 6 && (
        <div className="trip-calendar-container">
          <h2 className="trip-subheader">여행 일정이 어떻게 되세요?</h2>
          <div className="calendar-inputs">
            <label>시작 날짜: {formData.startDate}</label>
            <label>종료 날짜: {formData.endDate}</label>
          </div>
          <Calendar
            selectRange={true}
            onChange={handleDateChange}
            value={selectedDates}
            minDate={new Date()}
            formatDay={(locale, date) => date.getDate()}
          />
        </div>
      )}
    </div>
  );
}

export default Trips;
