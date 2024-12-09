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
    detail_destination: '',
    style: '',
    startDate: '',
    endDate: '',
  });
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [customDestination, setCustomDestination] = useState('');
  const [customStyle, setCustomStyle] = useState('');

  // 사용자가 입력한 값을 상태로 업데이트
  const handleInputChange = (field, value) => {
    let transformedValue = value;

    // 성별 필드 변환
    if (field === 'gender') {
      if (value === 'female') transformedValue = '여성';
      else if (value === 'male') transformedValue = '남성';
      else if (value === 'none') transformedValue = '기타';
    }

    setFormData((prev) => {
      const updatedFormData = { ...prev, [field]: transformedValue };
      if (field === 'destination') {
        console.log('Updated destination:', updatedFormData.destination);

        // 경북 또는 제주 선택 시 세부 지역 화면에서 다음 스텝으로 바로 이동
        if (value === '경북' || value === '제주') {
          setStep(5); // 세부 지역 선택 화면
        } else {
          setStep(6); // 경북/제주가 아닌 경우 여행 스타일 선택 화면으로 이동
        }
      }

      // 세부 지역 선택 후 다음 스텝(6)으로 이동
      if (field === 'detail_destination') {
        setStep(6); // 세부 지역 선택 후 스텝 6으로 이동
      }

      return updatedFormData;
    });

    if (field !== 'destination' && field !== 'detail_destination') {
      setStep((prevStep) => prevStep + 1);
    }
  };

  // 날짜 변경 핸들러 (ISO 형식으로 변환)
  const handleDateChange = (date) => {
    setSelectedDates(date);
    setFormData({
      ...formData,
      startDate: date[0]?.toLocaleDateString('en-CA'),
      endDate: date[1]?.toLocaleDateString('en-CA') || '',
    });
  };

  // 스텝 이동 핸들러
  const handleStepBack = () => {
    setStep((prevStep) => {
      // 현재 스텝에서 뒤로가기 시 스텝 5를 건너뛰도록 조건 추가
      if (prevStep === 6 && formData.destination !== '경북' && formData.destination !== '제주') {
        return 4; // 6에서 4로 바로 이동
      }
      return prevStep - 1; // 일반적인 뒤로가기
    });
  };

  // 여행 계획 생성 함수 (데이터 전달)
  const handleCreateTrip = useCallback(() => {
    console.log('FormData being sent:', formData);
    navigate('/trip-result', { state: { formData } });
  }, [formData, navigate]);

  // 여행 일정이 선택된 후 이동
  useEffect(() => {
    if (step === 7 && formData.startDate && formData.endDate) {
      handleCreateTrip();
    }
  }, [step, formData, handleCreateTrip]);

  const progressWidth = `${(step / 7) * 100}%`;

  return (
    <div className="trip-container">
      <div className="header">
        <span className="back-button" onClick={() => step > 1 && handleStepBack()}>
          &larr;
        </span>
        <div className="progress-container">
          <div className="step-indicator">
            <div className="step-progress" style={{ width: progressWidth }}></div>
          </div>
        </div>
      </div>

      <div className="step-text">{step}/7</div>

      {/* Step별 UI 구성 */}
      {step === 1 && (
        <div className="trip-radio-group">
          <h2 className="trip-subheader">성별이 어떻게 되세요?</h2>
          <button className="trip-radio-button" onClick={() => handleInputChange('gender', 'female')}>
            여성
          </button>
          <button className="trip-radio-button" onClick={() => handleInputChange('gender', 'male')}>
            남성
          </button>
          <button className="trip-radio-button" onClick={() => handleInputChange('gender', 'none')}>
            선택안함
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="trip-radio-group">
          <h2 className="trip-subheader">연령이 어떻게 되세요?</h2>
          {['10대', '20대', '30대', '40대', '50대', '60대이상'].map((age) => (
            <button key={age} className="trip-radio-button" onClick={() => handleInputChange('age', age)}>
              {age}
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="trip-radio-group">
          <h2 className="trip-subheader">누구와 함께 가실건가요?</h2>
          {['혼자', '연인', '친구', '부모님', '아이', '기타'].map((companion) => (
            <button key={companion} className="trip-radio-button" onClick={() => handleInputChange('companion', companion)}>
              {companion}
            </button>
          ))}
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="trip-subheader">어디로 여행을 가실건가요?</h2>
          <div className="trip-radio-grid">
            {['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '세종', '제주'].map(
              (destination) => (
                <button
                  key={destination}
                  className="trip-radio-button"
                  onClick={() => handleInputChange('destination', destination)}
                >
                  {destination}
                </button>
              )
            )}
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

      {step === 5 && formData.destination === '경북' && (
        <div className="trip-radio-group">
          <h2 className="trip-subheader">세부 지역을 선택해주세요.</h2>
          <button className="trip-radio-button" onClick={() => handleInputChange('detail_destination', '경주')}>
            경주
          </button>
          <button className="trip-radio-button" onClick={() => handleInputChange('detail_destination', '')}>
            미정
          </button>
        </div>
      )}

      {step === 5 && formData.destination === '제주' && (
        <div className="trip-radio-group">
          <h2 className="trip-subheader">세부 지역을 선택해주세요.</h2>
          <button className="trip-radio-button" onClick={() => handleInputChange('detail_destination', '제주')}>
            제주
          </button>
          <button className="trip-radio-button" onClick={() => handleInputChange('detail_destination', '서귀포')}>
            서귀포
          </button>
          <button className="trip-radio-button" onClick={() => handleInputChange('detail_destination', '')}>
            미정
          </button>
        </div>
      )}

      {step === 6 && (
        <div className="trip-radio-group">
          <h2 className="trip-subheader">여행 스타일이 어떻게 되세요?</h2>
          {['국가유산', '휴양', '액티비티', '식도락', '쇼핑', 'SNS감성'].map((style) => (
            <button key={style} className="trip-radio-button" onClick={() => handleInputChange('style', style)}>
              {style}
            </button>
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

      {step === 7 && (
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
