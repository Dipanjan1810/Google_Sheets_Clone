export const SUM = (range) => range.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
export const AVERAGE = (range) => SUM(range) / range.length || 0;
export const MAX = (range) => Math.max(...range.map((val) => parseFloat(val) || -Infinity));
export const MIN = (range) => Math.min(...range.map((val) => parseFloat(val) || Infinity));
export const COUNT = (range) => range.filter((val) => !isNaN(parseFloat(val))).length;

export const applyFormula = (formula, grid, range) => {
    const cells = range.map(([r, c]) => grid[r][c]);
    return formula(cells);
  };
  