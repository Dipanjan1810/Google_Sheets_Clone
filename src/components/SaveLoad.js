const saveSpreadsheet = (grid) => {
    localStorage.setItem("spreadsheet", JSON.stringify(grid));
  };
  
  const loadSpreadsheet = () => {
    const savedGrid = localStorage.getItem("spreadsheet");
    return savedGrid ? JSON.parse(savedGrid) : null;
  };
  