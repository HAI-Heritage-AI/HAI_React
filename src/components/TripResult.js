import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/TripResult.css';
import chatIcon from "../assets/chat.svg";
import ChatBox from "./ChatBox";
import FestivalList from "./FestivalList"; // FestivalList 추가

const TripResult = () => {
  const location = useLocation();
  const [tripData, setTripData] = useState(null);
  const [festivalData, setFestivalData] = useState([]); // 축제 데이터 상태 추가
  const [currentDay, setCurrentDay] = useState("Day 1"); // 문자열로 초기 설정
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editedEvent, setEditedEvent] = useState({ time: '', place: '' });
  const [searchResults, setSearchResults] = useState([]);
  const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
  const markersRef = useRef([]);
  const mapRef = useRef(null);
  const chatBoxRef = useRef(null); // ChatBox DOM 참조

  // 서버에 요청을 한 번만 보내도록 제어하기 위한 상태 추가
  const [hasFetchedTripData, setHasFetchedTripData] = useState(false);

  useEffect(() => {
    const checkKakaoMapLoad = () => {
      if (window.kakao && window.kakao.maps) {
        setIsMapLoaded(true);
      } else {
        setTimeout(checkKakaoMapLoad, 500);
      }
    };
    checkKakaoMapLoad();
  }, []);

  // 좌표 정보를 각 이벤트에 추가하는 함수 (useCallback으로 감싸기)
  const addCoordinatesToEvents = useCallback(async (formattedData) => {
    const updatedData = await Promise.all(
      Object.entries(formattedData).map(async ([day, events]) => {
        const updatedEvents = await Promise.all(
          events.map(async (event) => {
            const coordinates = await getCoordinatesFromAddress(event.address);
            return { ...event, ...coordinates };
          })
        );
        return { [day]: updatedEvents };
      })
    );
    return Object.assign({}, ...updatedData);
  }, []);

  useEffect(() => {
    if (!isMapLoaded || hasFetchedTripData || tripData) return;

    const fetchTripData = async () => {
      try {
        const formData = location.state?.formData;
        if (!formData) {
          console.error("No form data available");
          return;
        }

        const response = await fetch('http://127.0.0.1:8000/api/plan/plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          console.error(`Failed to fetch trip data: ${response.status} - ${response.statusText}`);
          throw new Error('Failed to fetch trip data');
        }

        const data = await response.json();

        // travel_plan 데이터를 받아서 포맷팅하고 tripData 상태에 반영
        let formattedData = {};
        if (data.travel_plan) {
          formattedData = formatServerResponse(data.travel_plan);
        } else {
          throw new Error("Invalid response format: missing travel_plan");
        }

        const updatedData = await addCoordinatesToEvents(formattedData);
        setTripData(updatedData);
        setFestivalData(data.festivals || []);
        setHasFetchedTripData(true);
      } catch (error) {
        console.error("Error loading trip data:", error);
      }
    };

    fetchTripData();
  }, [isMapLoaded, location, addCoordinatesToEvents, tripData, hasFetchedTripData]);

  // 서버에서 받은 데이터를 프론트에서 사용하기 쉽게 가공하는 함수
  const formatServerResponse = (serverData) => {
    const formattedData = {};
    for (const [day, events] of Object.entries(serverData)) {
      if (!Array.isArray(events)) {
        console.error(`Invalid events data for ${day}: expected array but got`, events);
        continue;
      }
      formattedData[day] = events.map(event => {
        return {
          time: event.time,
          place: event.place.장소,
          address: event.place.address,
        };
      });
    }
    console.log("Formatted Data:", formattedData); // 여기에서 데이터가 올바르게 포맷되었는지 확인
    return formattedData;
  };

  const getCoordinatesFromAddress = async (address) => {
    return new Promise((resolve) => {
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

  const setMapBoundsForDay = (dayEvents) => {
    const bounds = new window.kakao.maps.LatLngBounds();
    dayEvents.forEach(event => {
      if (event.lat && event.lng) {
        bounds.extend(new window.kakao.maps.LatLng(event.lat, event.lng));
      }
    });
    mapRef.current.setBounds(bounds);
  };

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

  useEffect(() => {
    if (!isMapLoaded || !tripData) return;

    const initializeMap = () => {
      const container = document.getElementById('map');
      if (!container) {
        setTimeout(initializeMap, 500);
        return;
      }

      mapRef.current = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(35.9078, 127.7669),
        level: 13,
      });

      if (tripData[currentDay]) {
        addMarkersToMap(tripData[currentDay]);
        setMapBoundsForDay(tripData[currentDay]);
      }
    };

    initializeMap();
  }, [isMapLoaded, tripData, currentDay, addMarkersToMap]);

  // 현재 날짜 선택 시 처리
  const handleDayChange = (dayKey) => {
    setCurrentDay(dayKey);
    if (tripData[dayKey]) {
      addMarkersToMap(tripData[dayKey]);
      setMapBoundsForDay(tripData[dayKey]);
    }
  };

  const handleEditClick = (index, field) => {
    setEditIndex(index);
    setEditField(field);
    setEditedEvent({ ...tripData[currentDay][index] });
  };

  const handleInputChange = async (field, value) => {
    setEditedEvent((prev) => ({ ...prev, [field]: value }));

    if (field === 'place' && value) {
      const places = new window.kakao.maps.services.Places();
      places.keywordSearch(value, (results, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSearchResults(results.slice(0, 3));
        } else {
          setSearchResults([]);
        }
      });
    }
  };

  const handlePlaceSelect = (selectedPlace) => {
    const { place_name, y: lat, x: lng, address_name } = selectedPlace;
    setEditedEvent({ ...editedEvent, place: place_name });

    setTripData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[currentDay][editIndex] = {
        ...editedEvent,
        place: place_name,
        address: address_name,
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };
      return updatedData;
    });

    setMapBoundsForDay(tripData[currentDay]);
    setSearchResults([]);
  };

  const handleBlur = (index) => {
    const updatedTripData = { ...tripData };
    updatedTripData[currentDay][index] = editedEvent;
    setTripData(updatedTripData);
    setEditIndex(null);
    setEditField(null);
    setSearchResults([]);
  };

  const toggleChatBox = () => {
    setIsChatBoxOpen((prev) => !prev);
  };

  // ChatBox 외부 클릭 시 채팅창 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
        setIsChatBoxOpen(false);
      }
    };

    // 외부 클릭 감지 이벤트 리스너 등록
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chatBoxRef]);

  if (!tripData) return <div>여행 계획을 로드하는 중입니다...</div>;

  return (
    <div className="trip-result-container">
      <div id="map" className="map-container"></div>

      <div className="trip-details">
        <div className="day-selector">
          {tripData && Object.keys(tripData).map((day, index) => (
            <button
              key={index}
              onClick={() => handleDayChange(day)}
              className={`day-button ${day === currentDay ? 'active' : ''}`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="trip-details-list">
          {(tripData[currentDay] || []).map((event, index) => (
            <div key={index} className="event-item">
              {editIndex === index && editField === 'time' ? (
                <input
                  type="text"
                  value={editedEvent.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  onBlur={() => handleBlur(index)}
                  className="inline-edit-input time-input"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => handleEditClick(index, 'time')}
                  className="editable-text"
                >
                  {event.time}
                </span>
              )}

              {editIndex === index && editField === 'place' ? (
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type="text"
                    value={editedEvent.place}
                    onChange={(e) => handleInputChange('place', e.target.value)}
                    onBlur={() => handleBlur(index)}
                    className="inline-edit-input place-input"
                    autoFocus
                  />
                  {searchResults.length > 0 && (
                    <div className="search-results">
                      {searchResults.map((result, idx) => (
                        <div key={idx} onClick={() => handlePlaceSelect(result)} className="search-result-item">
                          {result.place_name} - {result.address_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span
                  onClick={() => handleEditClick(index, 'place')}
                  className="editable-text"
                >
                  {event.place}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 축제 리스트 표시 */}
      <FestivalList festivals={festivalData} />

      {/* 오른쪽 하단 채팅 아이콘 */}
      <div className="chat-icon" onClick={toggleChatBox}>
        <img src={chatIcon} alt="Chat Icon" className="chat-icon-image" />
      </div>

      {isChatBoxOpen && (
        <div ref={chatBoxRef}>
          <ChatBox tripData={tripData} /> 
        </div>
      )}
    </div>
  );
};

export default TripResult;