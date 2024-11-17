import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './styles/HeritageDetail.css';

function HeritageDetail() {
  const { id } = useParams(); // URL에서 id 가져오기
  const [heritage, setHeritage] = useState(null);
  const [loading, setLoading] = useState(true);

  // API를 통해 ID 기반으로 데이터 가져오기
  useEffect(() => {
    console.log("Fetched ID from URL:", id); // ID 확인
    const fetchHeritageById = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/book/heritage/${id}`); // ID 기반 API 호출
        setHeritage(response.data); // API 응답 데이터를 상태에 저장
      } catch (error) {
        console.error("유산 데이터를 가져오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeritageById();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!heritage || heritage.error) {
    return <div>유산 데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="heritage-detail-container">
      <div className="image-section">
        {heritage.imageurl ? (
          <img src={heritage.imageurl} alt={heritage.ccbamnm1} />
        ) : (
          <span>이미지 없음</span>
        )}
      </div>
      <div className="heritage-info">
        <h1>
          {heritage.ccbamnm1}
          <span className="sub-text">({heritage.ccbamnm2})</span> {/* 한자 이름 표시 */}
        </h1>
        <p>
          <strong>소재지:</strong> {heritage.ccbalcad}
        </p>
        <div className="heritage-content-box">
          <p>{heritage.content}</p> {/* content를 스크롤 가능한 박스에 표시 */}
        </div>
      </div>
    </div>
  );
}

export default HeritageDetail;
