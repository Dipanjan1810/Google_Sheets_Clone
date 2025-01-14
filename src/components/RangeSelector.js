import React, { useState } from "react";

const RangeSelector = ({ onRangeSelected }) => {
  const [startCell, setStartCell] = useState(null);
  const [endCell, setEndCell] = useState(null);

  const handleCellClick = (row, col) => {
    if (!startCell) {
      setStartCell({ row, col });
    } else {
      setEndCell({ row, col });
      onRangeSelected(startCell, { row, col });
    }
  };

  return (
    <div className="range-selector">
      {/* Example Grid */}
      {Array.from({ length: 10 }).map((_, row) => (
        <div key={row} className="row">
          {Array.from({ length: 10 }).map((_, col) => (
            <div
              key={col}
              className={`cell ${
                startCell && endCell && row >= startCell.row && row <= endCell.row &&
                col >= startCell.col && col <= endCell.col
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleCellClick(row, col)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default RangeSelector;
