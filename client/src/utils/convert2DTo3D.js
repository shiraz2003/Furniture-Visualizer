export function convert2DTo3D(items) {
  return items.map(i => ({ ...i, z: 0 }));
}