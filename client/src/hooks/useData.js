// Deprecated: prefer useDataSource with a unified descriptor.
export default function useData() {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('[deprecation] useData: use useDataSource(descriptor) instead.');
  }
  return { data: null };
}
