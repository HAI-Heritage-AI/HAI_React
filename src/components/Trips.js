import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles/Trip.css';

function Trips() {
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
  
  // 직접 입력 텍스트 관리 상태 추가
  const [customDestination, setCustomDestination] = useState('');
  const [customStyle, setCustomStyle] = useState('');

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setStep(step + 1); // 선택 시 다음 단계로 자동 진행
  };

  const handleDateChange = (date) => {
    setSelectedDates(date);
    setFormData({
      ...formData,
      startDate: date[0].toLocaleDateString('ko-KR'),
      endDate: date[1] ? date[1].toLocaleDateString('ko-KR') : '',
    });
  };

  const progressWidth = `${(step / 6) * 100}%`;

  return (
    <div className="trip-container">
      {/* 상단 고정 헤더 */}
      <div className="header">
        <span className="back-button" onClick={() => step > 1 && setStep(step - 1)}>&larr;</span>
        <div className="progress-container">
          <div className="step-indicator">
            <div className="step-progress" style={{ width: progressWidth }}></div>
          </div>
        </div>
      </div>

      {/* 단계 표시 (질문 위) */}
      <div className="step-text">{step}/6</div>

      {/* 단계별 입력 화면 */}
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
          {['휴양', '액티비티', '식도락', '쇼핑', 'SNS 감성'].map(style => (
            <button key={style} className="trip-radio-button" onClick={() => handleInputChange('style', style)}>{style}</button>
          ))}
          {/* 입력 필드만 남김 */}
          <input
            type="text"
            className="custom-input"
            placeholder="직접 입력"
            value={customStyle}
            onChange={(e) => setCustomStyle(e.target.value)}
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
            formatDay={(locale, date) => date.getDate()} // 날짜에 "일" 제거
          />
        </div>
      )}
    </div>
  );
}

export default Trips;
