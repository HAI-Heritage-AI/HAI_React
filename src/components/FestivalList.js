import React from "react";
import "./styles/FestivalList.css";

const FestivalList = ({ festivals }) => {
  if (!festivals || festivals.length === 0) {
    return <div className="festival-list-container">표시할 축제가 없습니다.</div>;
  }

  return (
    <div className="festival-list-container">
      <h2 className="festival-title">체크해볼만한 축제 리스트</h2>
      <ul className="festival-list">
        {festivals.map((festival, index) => (
          <li key={index} className="festival-item">
            <div className="festival-name">{festival.축제명}</div>
            <div className="festival-date">
              {festival.축제시작일자} ~ {festival.축제종료일자}
            </div>
            <div className="festival-location">{festival.개최장소}</div>
            {festival.축제내용 && <div className="festival-description">{festival.축제내용}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FestivalList;
