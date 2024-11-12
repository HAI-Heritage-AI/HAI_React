import React, { useEffect, useState, useCallback, useRef } from 'react';
import './styles/TripResult.css';

const TripResult = () => {
  const [tripData, setTripData] = useState(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editedEvent, setEditedEvent] = useState({ time: '', place: '' });
  const [searchResults, setSearchResults] = useState([]);
  const markersRef = useRef([]);
  const mapRef = useRef(null);

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

  useEffect(() => {
    if (!isMapLoaded) return;

    const fetchTripData = async () => {
      try {
        const response = await fetch('/tripData.json');
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
      } catch (error) {
        console.error("Error loading trip data:", error);
      }
    };

    fetchTripData();
  }, [isMapLoaded]);

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

      if (tripData[`Day ${currentDay}`]) {
        addMarkersToMap(tripData[`Day ${currentDay}`]);
        setMapBoundsForDay(tripData[`Day ${currentDay}`]);
      }
    };

    initializeMap();
  }, [isMapLoaded, tripData, currentDay, addMarkersToMap]);

  const handleDayChange = (dayIndex) => {
    setCurrentDay(dayIndex);
  };

  const handleEditClick = (index, field) => {
    setEditIndex(index);
    setEditField(field);
    setEditedEvent({ ...tripData[`Day ${currentDay}`][index] });
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
      updatedData[`Day ${currentDay}`][editIndex] = {
        ...editedEvent,
        place: place_name,
        address: address_name,
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };
      return updatedData;
    });
  
    setMapBoundsForDay(tripData[`Day ${currentDay}`]);
    setSearchResults([]);
  };

  const handleBlur = (index) => {
    const updatedTripData = { ...tripData };
    updatedTripData[`Day ${currentDay}`][index] = editedEvent;
    setTripData(updatedTripData);
    setEditIndex(null);
    setEditField(null);
    setSearchResults([]);
  };

  if (!tripData) return <div></div>;

  return (
    <div className="trip-result-container">
      <input
        type="text"
        placeholder="여행 플래너 에이전트에게 무엇이든 질문해보세요"
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

        <div className="trip-details-list">
          {(tripData[`Day ${currentDay}`] || []).map((event, index) => (
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
    </div>
  );
};

export default TripResult;
