import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BookFilterGroup from './BookFilterGroup';
import BookHeritageCard from './BookHeritageCard';
import { fetchHeritageData, fetchFilteredHeritageData } from './BookApi';
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
        console.log(allData); // 데이터가 잘 들어오는지 확인
        setData(allData);
        setFilteredData(allData);
        setCategories(['전체', ...new Set(allData.map((item) => item.ccmaname))]);
        setRegions(['전체', ...new Set(allData.map((item) => item.ccbactcdnm))]);
        setPeriods(['전체', ...new Set(allData.map((item) => item.cccename))]);
    } catch (error) {
        console.error('데이터 가져오기 실패', error);
    } finally {
        setLoading(false);
    }
    }, []);


  const applyFilter = useCallback(async () => {
    setLoading(true);
    try {
      const category = selectedCategory === "전체" ? null : selectedCategory;
      const region = selectedRegion === "전체" ? null : selectedRegion;
      const period = selectedPeriod === "전체" ? null : selectedPeriod;
  
      const filteredData = await fetchFilteredHeritageData(category, region, period);
      setFilteredData(filteredData); // 필터가 적용된 데이터를 저장
    } catch (error) {
      console.error("필터 적용 중 오류 발생", error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          searchTerms.every(
            (term) =>
              item.ccbamnm1 && // item.ccbaMnm1이 존재하는지 확인
              item.ccbamnm1.toLowerCase().includes(term)
          )
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
          {filteredData.map((item, index) => (
              <BookHeritageCard key={item.ccbaAsno || index} item={item} onClick={handleCardClick} />
          ))}
      </div>



      {loading && <div></div>}
    </div>
  );
}

export default Book;