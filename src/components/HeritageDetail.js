import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './styles/HeritageDetail.css';
import nationalHeritageData from './national_heritage_full_data.json'; // JSON 데이터 불러오기

function HeritageDetail() {
  const { id } = useParams(); // URL에서 ID 가져오기
  const [heritage, setHeritage] = useState(null);

  // 유산 데이터를 ID 기반으로 검색
  useEffect(() => {
    const selectedHeritage = nationalHeritageData.find(item => item.ccbaAsno === parseInt(id));
    setHeritage(selectedHeritage);
  }, [id]);

  if (!heritage) {
    return <div>Loading...</div>;
  }

  return (
    <div className="heritage-detail-container">
      <div className="image-section">
        {heritage.imageUrl ? (
          <img src={heritage.imageUrl} alt={heritage.ccbaMnm1} />
        ) : (
          <span>이미지 없음</span>
        )}
      </div>
      <div className="heritage-info">
        <h1>
          {heritage.ccbaMnm1} ({heritage.ccbaMnm2})
        </h1>
        <p>
          <strong>소재지:</strong> {heritage.ccbaLcad}
        </p>
        <p>{heritage.content}</p>
      </div>
    </div>
  );
}

export default HeritageDetail;
