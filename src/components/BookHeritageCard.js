import React from 'react';

function BookHeritageCard({ item, onClick }) {
  return (
    <div className="heritage-card" onClick={() => onClick(item.ccbaasno)}>
      <div className="image-placeholder">
        {item.imageurl ? <img src={item.imageurl} alt={item.ccbamnm1} /> : <span>이미지 없음</span>}
      </div>
      <div className="heritage-name">{item.ccbamnm1}</div>
    </div>
  );
}

export default BookHeritageCard;
