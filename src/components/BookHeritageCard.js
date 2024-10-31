import React from 'react';

function BookHeritageCard({ item, onClick }) {
  return (
    <div className="heritage-card" onClick={() => onClick(item.ccbaAsno)}>
      <div className="image-placeholder">
        {item.imageUrl ? <img src={item.imageUrl} alt={item.ccbaMnm1 || "국가유산"} /> : <span>이미지 없음</span>}
      </div>
      <div className="heritage-name">{item.ccbaMnm1 || "이름 없음"}</div>
    </div>
  );
}

export default BookHeritageCard;