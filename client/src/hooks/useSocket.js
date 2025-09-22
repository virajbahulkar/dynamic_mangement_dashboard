export default function useSocket() {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('[deprecation] useSocket: use useDataSource with transport="socket" instead.');
  }
  return { socket: null };
}
