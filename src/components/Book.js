import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BookFilterGroup from './BookFilterGroup';
import BookHeritageCard from './BookHeritageCard';
import { fetchHeritageData } from './BookApi'; // 모든 데이터를 한 번에 불러오는 API
import './styles/Book.css';

function Book() {
  const [allData, setAllData] = useState([]); // 모든 데이터를 저장
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [displayedData, setDisplayedData] = useState([]); // 화면에 표시할 데이터
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(10); // 한번에 보여줄 아이템 수

  const navigate = useNavigate();

  // 초기 데이터 로드
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHeritageData(); // 모든 데이터를 한 번에 가져옴
      setAllData(data);
      setCategories(['전체', ...new Set(data.map((item) => item.ccmaname))]);
      setRegions(['전체', ...new Set(data.map((item) => item.ccbactcdnm))]);
      setPeriods(['전체', ...new Set(data.map((item) => item.cccename))]);
      setDisplayedData(data.slice(0, 10)); // 처음에 10개만 표시
    } catch (error) {
      console.error('데이터 가져오기 실패', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // 필터 적용
  useEffect(() => {
    let filtered = allData;

    if (selectedCategory && selectedCategory !== '전체') {
      filtered = filtered.filter(item => item.ccmaname === selectedCategory);
    }
    if (selectedRegion && selectedRegion !== '전체') {
      filtered = filtered.filter(item => item.ccbactcdnm === selectedRegion);
    }
    if (selectedPeriod && selectedPeriod !== '전체') {
      filtered = filtered.filter(item => item.cccename === selectedPeriod);
    }

    setDisplayedData(filtered.slice(0, displayCount)); // 필터링된 데이터에서 처음 10개만 표시
  }, [selectedCategory, selectedRegion, selectedPeriod, allData, displayCount]);

  // 스크롤 이벤트로 추가 데이터 로드
  const loadMoreData = () => {
    setDisplayCount((prevCount) => prevCount + 10); // 추가로 10개씩 표시
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMoreData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 검색 필터링 함수
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm === '') {
      setDisplayedData(allData.slice(0, displayCount));
    } else {
      const searchTerms = searchTerm.split(/\s+/);
      const filtered = allData.filter((item) =>
        searchTerms.every(
          (term) =>
            item.ccbamnm1 &&
            item.ccbamnm1.toLowerCase().includes(term)
        )
      );
      setDisplayedData(filtered.slice(0, displayCount));
    }
  };

  const handleCardClick = (id) => {
    navigate(`/heritage/${id}`);
  };

  return (
    <div className="book-container">
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="찾으시는 국가유산 이름을 검색해 보세요"
          className="search-input"
          onChange={handleSearch}
        />
        <div className="filter-buttons">
          <BookFilterGroup
            title="종목별"
            options={categories}
            selectedOption={selectedCategory}
            onSelectOption={setSelectedCategory}
          />
          <BookFilterGroup
            title="지역별"
            options={regions}
            selectedOption={selectedRegion}
            onSelectOption={setSelectedRegion}
          />
          <BookFilterGroup
            title="시대별"
            options={periods}
            selectedOption={selectedPeriod}
            onSelectOption={setSelectedPeriod}
          />
        </div>
      </div>

      <div className="heritage-grid">
        {displayedData.map((item) => (
          <BookHeritageCard
            key={item.id} // Primary Key 사용
            item={item}
            onClick={handleCardClick} // 클릭 시 handleCardClick 호출
          />
        ))}
      </div>

      {loading && <div className="loading"></div>}
    </div>
  );
}

export default Book;
