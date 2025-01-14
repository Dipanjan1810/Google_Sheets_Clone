import React, { useState, useRef } from "react";
import "./Spreadsheet.css";

const Spreadsheet = () => {
  const rows = 20;
  const cols = 10;

  const [grid, setGrid] = useState(
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ value: "", formula: "" }))
    )
  );

  const [selectedCell, setSelectedCell] = useState(null);
  const [formula, setFormula] = useState("");
  const [multiSelect, setMultiSelect] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const undoStack = useRef([]);
  const redoStack = useRef([]);

  // Select a single cell
  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
    setFormula(grid[row][col].formula || grid[row][col].value); // Show formula
    setMultiSelect([]); // Clear multi-select
  };

  // Start multi-selection or drag
  const handleMouseDown = (row, col) => {
    setSelectedCell({ row, col });
    setMultiSelect([{ row, col }]);
    setIsDragging(true);
  };

  // Multi-select cells or drag cells
  const handleMouseOver = (row, col) => {
    if (isDragging) {
      setMultiSelect((prev) =>
        prev.some((sel) => sel.row === row && sel.col === col)
          ? prev
          : [...prev, { row, col }]
      );
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Update cell value
  const handleCellChange = (row, col, value) => {
    const updatedGrid = [...grid];
    updatedGrid[row][col] = { value, formula: "" };
    setGrid(updatedGrid);
    saveUndoState(updatedGrid);
  };

  // Handle formula input
  const handleFormulaChange = (e) => {
    setFormula(e.target.value);
  };

  const applyFormula = () => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;
    const updatedGrid = [...grid];

    updatedGrid[row][col] = {
      value: formula.startsWith("=") ? evaluateFormula(formula) : formula,
      formula, // Save formula for later
    };

    setGrid(updatedGrid);
    saveUndoState(updatedGrid);
  };

  // Evaluate the formula
  const evaluateFormula = (formula) => {
    if (!formula.startsWith("=")) return formula;

    try {
      const rangeMatch = formula.match(/([A-Z]+\d+):([A-Z]+\d+)/); // Match ranges like A1:A5
      if (rangeMatch) {
        const [, startCell, endCell] = rangeMatch;
        const rangeCells = parseRange(startCell, endCell);

        const values = rangeCells.map(([row, col]) => {
          return parseFloat(grid[row][col].value) || 0;
        });

        if (formula.startsWith("=SUM")) return values.reduce((a, b) => a + b, 0);
        if (formula.startsWith("=AVERAGE"))
          return values.reduce((a, b) => a + b, 0) / values.length;

        return "INVALID";
      }

      return "INVALID";
    } catch (error) {
      console.error("Formula evaluation error:", error);
      return "ERROR";
    }
  };

  // Parse cell range like A1:A5
  const parseRange = (startCell, endCell) => {
    const startCol = startCell.charCodeAt(0) - 65;
    const startRow = parseInt(startCell.slice(1)) - 1;

    const endCol = endCell.charCodeAt(0) - 65;
    const endRow = parseInt(endCell.slice(1)) - 1;

    const cells = [];
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        cells.push([row, col]);
      }
    }
    return cells;
  };

  // Save undo state
  const saveUndoState = (currentGrid) => {
    undoStack.current.push(JSON.stringify(currentGrid));
    redoStack.current = []; // Clear redo stack
  };

  // Undo action
  const undo = () => {
    if (undoStack.current.length > 0) {
      const lastState = undoStack.current.pop();
      redoStack.current.push(JSON.stringify(grid));
      setGrid(JSON.parse(lastState));
    }
  };

  // Redo action
  const redo = () => {
    if (redoStack.current.length > 0) {
      const nextState = redoStack.current.pop();
      undoStack.current.push(JSON.stringify(grid));
      setGrid(JSON.parse(nextState));
    }
  };

  // Save to localStorage
  const saveGrid = () => {
    localStorage.setItem("spreadsheet", JSON.stringify(grid));
  };

  // Load from localStorage
  const loadGrid = () => {
    const savedGrid = localStorage.getItem("spreadsheet");
    if (savedGrid) {
      setGrid(JSON.parse(savedGrid));
    }
  };

  return (
    <div className="spreadsheet">
      {/* Formula Bar */}
      <div className="toolbar">
        <input
          type="text"
          className="formula-bar"
          value={formula}
          onChange={handleFormulaChange}
          placeholder="Enter formula or value"
        />
        <button onClick={applyFormula}>Apply</button>
        <button onClick={saveGrid}>Save</button>
        <button onClick={loadGrid}>Load</button>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>

      {/* Grid */}
      <div
        className="grid-container"
        onMouseUp={handleMouseUp}
      >
        {/* Header Row */}
        <div className="row header-row">
          <div className="cell corner-cell"></div>
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div key={colIdx} className="cell header-cell">
              {String.fromCharCode(65 + colIdx)}
            </div>
          ))}
        </div>

        {/* Rows */}
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="row">
            <div className="cell header-cell">{rowIdx + 1}</div>
            {row.map((cell, colIdx) => (
              <div
                key={`${rowIdx}-${colIdx}`}
                className={`cell ${
                  selectedCell?.row === rowIdx &&
                  selectedCell?.col === colIdx
                    ? "selected"
                    : ""
                } ${
                  multiSelect.some(
                    (sel) => sel.row === rowIdx && sel.col === colIdx
                  )
                    ? "multi-selected"
                    : ""
                }`}
                onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                onMouseOver={() => handleMouseOver(rowIdx, colIdx)}
                onClick={() => handleCellClick(rowIdx, colIdx)}
              >
                <input
                  type="text"
                  value={cell.value}
                  onChange={(e) =>
                    handleCellChange(rowIdx, colIdx, e.target.value)
                  }
                />
                {selectedCell?.row === rowIdx &&
                  selectedCell?.col === colIdx && (
                    <div
                      className="drag-marker"
                      onMouseDown={(e) => {
                        e.stopPropagation(); // Prevent multi-select
                        setIsDragging(true);
                      }}
                    ></div>
                  )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Spreadsheet;
