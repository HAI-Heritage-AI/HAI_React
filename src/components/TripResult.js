import React, { useEffect, useState, useCallback, useRef } from 'react';
import './styles/TripResult.css';

const TripResult = () => {
  console.log("TripResult component loaded");

  const [tripData, setTripData] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [mapCenter, setMapCenter] = useState({ lat: 35.1796, lng: 129.0756 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const markersRef = useRef([]); // markers를 useRef로 관리
  const mapRef = useRef(null); // map을 useRef로 관리

  // Kakao Map API가 로드되었는지 확인하는 함수
  useEffect(() => {
    const checkKakaoMapLoad = () => {
      if (window.kakao && window.kakao.maps) {
        setIsMapLoaded(true);
        console.log("Kakao Maps API initialized successfully");
      } else {
        console.log("Kakao Maps API not loaded, retrying...");
        setTimeout(checkKakaoMapLoad, 500);
      }
    };
    checkKakaoMapLoad();
  }, []);

  // Trip 데이터 불러오기
  useEffect(() => {
    if (!isMapLoaded) return;

    const fetchTripData = async () => {
      try {
        const response = await fetch('/tripData.json');
        if (!response.ok) {
          throw new Error('Failed to fetch trip data');
        }
        const data = await response.json();

        const updatedData = await Promise.all(
          Object.entries(data.result).map(async ([day, events]) => {
            const updatedEvents = await Promise.all(
              events.map(async (event) => {
                const coordinates = await getCoordinatesFromAddress(event.address);
                return { ...event, ...coordinates };
              })
            );
            return { [day]: updatedEvents };
          })
        );

        setTripData(Object.assign({}, ...updatedData));
        console.log("Updated trip data with coordinates:", updatedData);
      } catch (error) {
        console.error("Error loading trip data:", error);
      }
    };

    fetchTripData();
  }, [isMapLoaded]);

  // 주소로부터 좌표를 얻는 함수
  const getCoordinatesFromAddress = async (address) => {
    return new Promise((resolve) => {
      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        console.error("Kakao maps API or services library is not loaded.");
        resolve(null);
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, function(result, status) {
        if (status === window.kakao.maps.services.Status.OK) {
          const { y: lat, x: lng } = result[0];
          console.log(`Coordinates for ${address}:`, { lat, lng });
          resolve({ lat: parseFloat(lat), lng: parseFloat(lng) });
        } else {
          console.warn(`No results for address: ${address}`);
          resolve(null);
        }
      });
    });
  };

  // 마커를 추가하는 함수
  const addMarkersToMap = useCallback((locations) => {
    markersRef.current.forEach(marker => marker.setMap(null)); // 기존 마커 삭제
    const newMarkers = [];

    locations.forEach(location => {
      if (location.lat && location.lng) {
        const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(mapRef.current);
        console.log("Marker added at:", location);
        newMarkers.push(marker);
      }
    });

    markersRef.current = newMarkers; // useRef로 업데이트
  }, []);

  // Map 초기화 (한 번만 실행)
  useEffect(() => {
    if (!isMapLoaded || mapRef.current) return;

    const initializeMap = () => {
      const container = document.getElementById('map');
      if (!container) {
        console.error("Map container not found. Retrying...");
        setTimeout(initializeMap, 500); // container가 없을 경우 다시 시도
        return;
      }

      mapRef.current = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
        level: 3,
      });
      console.log("Map instance created");
    };

    initializeMap();
  }, [isMapLoaded, mapCenter]);

  // Day 변경 시 마커 업데이트
  useEffect(() => {
    if (mapRef.current && tripData && tripData[`Day ${currentDay}`]) {
      addMarkersToMap(tripData[`Day ${currentDay}`]);
    }
  }, [tripData, currentDay, addMarkersToMap]);

  // Day 변경 핸들러
  const handleDayChange = (dayIndex) => {
    setCurrentDay(dayIndex);
    const firstEvent = tripData && tripData[`Day ${dayIndex}`] && tripData[`Day ${dayIndex}`][0];
    if (firstEvent && firstEvent.lat && firstEvent.lng) {
      setMapCenter({ lat: firstEvent.lat, lng: firstEvent.lng });
      mapRef.current.setCenter(new window.kakao.maps.LatLng(firstEvent.lat, firstEvent.lng));
      console.log("Map center updated to:", { lat: firstEvent.lat, lng: firstEvent.lng });
    }
  };

  if (!tripData) return <div>Loading...</div>;

  return (
    <div className="trip-result-container">
      <input
        type="text"
        placeholder="여행 플래너 챗봇에게 무엇이든 질문해보세요"
        className="search-input"
      />

      <div id="map" className="map-container" style={{ width: "100%", height: "400px" }}></div>

      <div className="day-selector">
        {tripData && Object.keys(tripData).map((day, index) => (
          <button
            key={index}
            onClick={() => handleDayChange(index + 1)}
            className={`day-button ${index + 1 === currentDay ? 'active' : ''}`}
          >
            Day {index + 1}
          </button>
        ))}
      </div>

      <div className="trip-details">
        <h2>Day {currentDay} 일정</h2>
        {(tripData[`Day ${currentDay}`] || []).map((event, index) => (
          <div key={index} className="event-item">
            <span className="event-time">{event.time}</span>
            <span className="event-icon">📍</span>
            <span>{event.place}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripResult;
