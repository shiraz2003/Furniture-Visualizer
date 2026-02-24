export function snapToGrid(value, gridSize = 50) {
  return Math.round(value / gridSize) * gridSize;
}