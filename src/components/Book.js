import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [filteredData, setFilteredData] = useState([]); // 검색이나 필터링된 데이터를 저장
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(10); // 한번에 보여줄 아이템 수
  const [isSearchActive, setIsSearchActive] = useState(false); // 검색 필터링 여부를 저장

  const navigate = useNavigate();
  const heritageGridRef = useRef(null); // heritage-grid에 대한 ref 생성

  // 초기 데이터 로드
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHeritageData(); // 모든 데이터를 한 번에 가져옴
      setAllData(data);
      setCategories(['전체', ...new Set(data.map((item) => item.ccmaname))]);
      setRegions(['전체', ...new Set(data.map((item) => item.ccbactcdnm))]);
      setPeriods(['전체', ...new Set(data.map((item) => item.cccename))]);
      setFilteredData(data); // 처음에는 모든 데이터를 필터링 데이터로 설정
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

    setFilteredData(filtered);
    setDisplayedData(filtered.slice(0, displayCount)); // 필터링된 데이터에서 처음 10개만 표시
  }, [selectedCategory, selectedRegion, selectedPeriod, allData, displayCount]);

  // 스크롤 이벤트로 추가 데이터 로드
  const loadMoreData = useCallback(() => {
    setDisplayCount((prevCount) => {
      const newCount = prevCount + 10;
      if (isSearchActive) {
        setDisplayedData(filteredData.slice(0, newCount));
      } else {
        setDisplayedData(filteredData.slice(0, newCount));
      }
      return newCount;
    });
  }, [isSearchActive, filteredData]);

  // 특정 요소(heritage-grid)의 스크롤을 감지하여 추가 데이터 로드
  useEffect(() => {
    const handleScroll = () => {
      const element = heritageGridRef.current;
      if (element) {
        // 스크롤이 끝에 도달했는지 확인
        if (element.scrollTop + element.clientHeight >= element.scrollHeight - 100) {
          loadMoreData();
        }
      }
    };

    const element = heritageGridRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loadMoreData]); // loadMoreData를 의존성 배열에 추가

  // 검색 필터링 함수
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm === '') {
      setIsSearchActive(false);
      setFilteredData(allData);
      setDisplayedData(allData.slice(0, displayCount));
    } else {
      setIsSearchActive(true);
      const searchTerms = searchTerm.split(/\s+/);
      const filtered = allData.filter((item) =>
        searchTerms.every(
          (term) =>
            item.ccbamnm1 &&
            item.ccbamnm1.toLowerCase().includes(term)
        )
      );
      setFilteredData(filtered);
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

      <div className="heritage-grid" ref={heritageGridRef}>
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
