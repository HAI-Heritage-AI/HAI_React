import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/Book.css';

function Book() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const navigate = useNavigate();
  const limit = 10;

  // FastAPI에서 데이터를 페이징 방식으로 로드
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/heritage', {
        params: { limit, offset }
      });
      setData(prevData => [...prevData, ...response.data]);
      setFilteredData(prevData => [...prevData, ...response.data]);
      if (response.data.length < limit) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('데이터 가져오기 실패', error);
    } finally {
      setLoading(false);
    }
  }, [offset, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 무한 스크롤을 위한 IntersectionObserver 설정
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setOffset(prevOffset => prevOffset + limit);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setIsRegionOpen(false);
  };

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
    setIsPeriodOpen(false);
  };

  const handleCardClick = (id) => {
    navigate(`/heritage/${id}`);
  };

  return (
    <div className="book-container">
      {/* 검색 및 필터 영역 */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="찾으시는 국가유산 이름을 검색해 보세요"
          className="search-input"
          onChange={(e) => {
            const searchTerm = e.target.value.toLowerCase();
            setFilteredData(
              data.filter((item) =>
                item.ccbaMnm1.toLowerCase().includes(searchTerm)
              )
            );
          }}
        />
        <div className="filter-buttons">
          {/* 종목별 필터 */}
          <div className="filter-group">
            <button
              className="filter-button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              {selectedCategory ? selectedCategory : '종목별'}
            </button>
            {isCategoryOpen && (
              <ul className="dropdown-menu">
                {Array.from(new Set(data.map((item) => item.ccmaName))).map((option, index) => (
                  <li key={index} onClick={() => handleCategorySelect(option)}>
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 지역별 필터 */}
          <div className="filter-group">
            <button
              className="filter-button"
              onClick={() => setIsRegionOpen(!isRegionOpen)}
            >
              {selectedRegion ? selectedRegion : '지역별'}
            </button>
            {isRegionOpen && (
              <ul className="dropdown-menu">
                {Array.from(new Set(data.map((item) => item.ccbaCtcdNm))).map((option, index) => (
                  <li key={index} onClick={() => handleRegionSelect(option)}>
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 시대별 필터 */}
          <div className="filter-group">
            <button
              className="filter-button"
              onClick={() => setIsPeriodOpen(!isPeriodOpen)}
            >
              {selectedPeriod ? selectedPeriod : '시대별'}
            </button>
            {isPeriodOpen && (
              <ul className="dropdown-menu">
                {Array.from(new Set(data.map((item) => item.ccceName))).map((option, index) => (
                  <li key={index} onClick={() => handlePeriodSelect(option)}>
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 문화재 카드 리스트 */}
      <div className="heritage-grid">
        {filteredData.map((item, index) => {
          if (index === filteredData.length - 1) {
            return (
              <div
                ref={lastElementRef}
                key={item.ccbaAsno}
                className="heritage-card"
                onClick={() => handleCardClick(item.ccbaAsno)}
              >
                <div className="image-placeholder">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.ccbaMnm1} /> : <span>이미지 없음</span>}
                </div>
                <div className="heritage-name">{item.ccbaMnm1}</div>
              </div>
            );
          } else {
            return (
              <div
                key={item.ccbaAsno}
                className="heritage-card"
                onClick={() => handleCardClick(item.ccbaAsno)}
              >
                <div className="image-placeholder">
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.ccbaMnm1} /> : <span>이미지 없음</span>}
                </div>
                <div className="heritage-name">{item.ccbaMnm1}</div>
              </div>
            );
          }
        })}
      </div>
      {loading && <div>Loading...</div>}
    </div>
  );
}

export default Book;
