// TripResult.js
import React, { useEffect, useState, useCallback, useRef } from 'react';
import './styles/TripResult.css';

const TripResult = () => {
  console.log("TripResult component loaded");

  const [tripData, setTripData] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [mapCenter, setMapCenter] = useState({ lat: 35.1796, lng: 129.0756 });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const markersRef = useRef([]);
  const mapRef = useRef(null);

  useEffect(() => {
    // Kakao Map API 로드 확인
    const checkKakaoMapLoad = () => {
      if (window.kakao && window.kakao.maps) {
        setIsMapLoaded(true);
        console.log("Kakao Maps API initialized successfully");
      } else {
        setTimeout(checkKakaoMapLoad, 500);
      }
    };
    checkKakaoMapLoad();
  }, []);

  useEffect(() => {
    if (!isMapLoaded) return;

    // FastAPI에서 여행 데이터를 가져오는 함수
    const fetchTripData = async () => {
      try {
        const response = await fetch('http://localhost:8000/travel-plan/서울'); // 여행지 이름으로 호출
        if (!response.ok) throw new Error('Failed to fetch trip data');
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

        // 지도 범위 설정
        const bounds = new window.kakao.maps.LatLngBounds();
        updatedData.forEach(dayEvents => {
          dayEvents[`Day ${currentDay}`].forEach(event => {
            if (event.lat && event.lng) {
              bounds.extend(new window.kakao.maps.LatLng(event.lat, event.lng));
            }
          });
        });
        mapRef.current.setBounds(bounds);

      } catch (error) {
        console.error("Error loading trip data:", error);
      }
    };

    fetchTripData();
  }, [isMapLoaded, currentDay]);

  // 주소로 좌표를 얻는 함수
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
          resolve({ lat: parseFloat(lat), lng: parseFloat(lng) });
        } else {
          resolve(null);
        }
      });
    });
  };

  // 마커 추가 함수
  const addMarkersToMap = useCallback((locations) => {
    markersRef.current.forEach(marker => marker.setMap(null));
    const newMarkers = [];

    locations.forEach(location => {
      if (location.lat && location.lng) {
        const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng);
        const marker = new window.kakao.maps.Marker({ position: markerPosition });
        marker.setMap(mapRef.current);
        newMarkers.push(marker);
      }
    });

    markersRef.current = newMarkers;
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isMapLoaded || mapRef.current) return;

    const initializeMap = () => {
      const container = document.getElementById('map');
      if (!container) {
        setTimeout(initializeMap, 500);
        return;
      }

      mapRef.current = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
        level: 3,
      });
    };

    initializeMap();
  }, [isMapLoaded, mapCenter]);

  // 일정 변경 시 마커 업데이트
  useEffect(() => {
    if (mapRef.current && tripData && tripData[`Day ${currentDay}`]) {
      addMarkersToMap(tripData[`Day ${currentDay}`]);
    }
  }, [tripData, currentDay, addMarkersToMap]);

  const handleDayChange = (dayIndex) => {
    setCurrentDay(dayIndex);
    const firstEvent = tripData && tripData[`Day ${dayIndex}`] && tripData[`Day ${dayIndex}`][0];
    if (firstEvent && firstEvent.lat && firstEvent.lng) {
      setMapCenter({ lat: firstEvent.lat, lng: firstEvent.lng });
      mapRef.current.setCenter(new window.kakao.maps.LatLng(firstEvent.lat, firstEvent.lng));
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

      <div id="map" className="map-container"></div>

      <div className="trip-details">
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
        {/* Day 일정 표시 */}
        {(tripData[`Day ${currentDay}`] || []).map((event, index) => (
          <div key={index} className="event-item">
            <span className="event-time">{event.time}</span>
            <span>{event.place}</span>
          </div>
        ))}
      </div>

      <div className="bottom-nav">
        <button className="nav-button">Chat</button>
        <button className="nav-button">Book</button>
        <button className="nav-button active">Trips</button>
        <button className="nav-button">Profile</button>
      </div>
    </div>
  );
};

export default TripResult;
