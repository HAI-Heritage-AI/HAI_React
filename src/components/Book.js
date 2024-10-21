import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BookFilterGroup from './BookFilterGroup';
import BookHeritageCard from './BookHeritageCard';
import { fetchHeritageData, fetchFilteredHeritageData } from './bookApi';
import './styles/Book.css';

function Book() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 전체 데이터 및 필터 목록 로드
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const allData = await fetchHeritageData();
      setData(allData);
      setFilteredData(allData); // 전체 데이터를 필터링된 데이터로 설정

      // 필터 목록 추출 (중복 제거)
      setCategories(['전체', ...new Set(allData.map((item) => item.ccmaName))]);
      setRegions(['전체', ...new Set(allData.map((item) => item.ccbaCtcdNm))]);
      setPeriods(['전체', ...new Set(allData.map((item) => item.ccceName))]);
    } catch (error) {
      console.error('데이터 가져오기 실패', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilter = useCallback(async () => {
    setLoading(true);
    try {
      const filteredData = await fetchFilteredHeritageData(selectedCategory, selectedRegion, selectedPeriod);
      setFilteredData(filteredData); // 필터가 적용된 데이터를 저장
    } catch (error) {
      console.error('필터 적용 중 오류 발생', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedRegion, selectedPeriod]);

  useEffect(() => {
    if (selectedCategory || selectedRegion || selectedPeriod) {
      applyFilter();
    } else {
      fetchInitialData();
    }
  }, [selectedCategory, selectedRegion, selectedPeriod, applyFilter, fetchInitialData]);

  // 검색 필터링 함수 (띄어쓰기 무시, 부분 일치)
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
      setFilteredData(data); // 검색어가 없을 경우 전체 데이터를 복구
    } else {
      const searchTerms = searchTerm.split(/\s+/); // 띄어쓰기로 분리된 단어 배열
      setFilteredData(
        data.filter((item) =>
          searchTerms.every((term) => item.ccbaMnm1.toLowerCase().includes(term)) // 모든 단어가 부분적으로 포함되는지 확인
        )
      );
    }
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
          onChange={handleSearch} // 검색 입력값 변경 시 호출
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
        {filteredData.map((item) => (
          <BookHeritageCard key={item.ccbaAsno} item={item} onClick={handleCardClick} />
        ))}
      </div>
      {loading && <div>Loading...</div>}
    </div>
  );
}

export default Book;
