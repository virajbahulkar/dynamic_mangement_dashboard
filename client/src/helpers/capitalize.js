// Capitalizes the first letter of a string and returns the result
export function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
