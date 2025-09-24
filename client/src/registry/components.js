// Component registry mapping type keys to lazy loaders.
// Keys follow pattern: domain.variant (e.g., chart.bar, table.basic)

const registry = {
  'chart.line': () => import('../components/Charts/LineChart'),
  'chart.bar': () => import('../components/Charts/Bar'),
  'chart.stackedBar': () => import('../components/Charts/StackedBar'),
  'chart.pie': () => import('../components/Charts/Pie'),
  'table.basic': () => import('../components/Table'),
  'ui.button': () => import('../components/Button'),
};

export function hasComponent(type) {
  return Boolean(registry[type]);
}

export async function loadComponent(type) {
  const loader = registry[type];
  if (!loader) throw new Error(`Registry: component not found for type ${type}`);
  const mod = await loader();
  return mod.default || mod;
}

export function listRegistered() {
  return Object.keys(registry).sort();
}

export default registry;
