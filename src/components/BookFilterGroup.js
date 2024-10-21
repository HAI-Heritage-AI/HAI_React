import React, { useState } from 'react';

function BookFilterGroup({ title, options = [], selectedOption, onSelectOption }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="filter-group">
      <button
        className="filter-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption || title}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.length > 0 ? options.map((option, index) => (
            <li key={index} onClick={() => {
              onSelectOption(option);
              setIsOpen(false);
            }}>
              {option}
            </li>
          )) : <li>Loading...</li>}
        </ul>
      )}
    </div>
  );
}

export default BookFilterGroup;