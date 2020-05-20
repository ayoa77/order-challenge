// Round price to the nearest penny
export const setPrice = function(num: number): number {
  return Math.round((num / 1e2) * 1e2);
};
