// Typed transform step union plus runtime validator. Legacy steps pass through (e.g., pickFields) for backward compatibility.

export interface FilterStep { op: 'filter'; expr: Record<string, any>; }
export interface MapStep { op: 'map'; expr: string; }
export interface LimitStep { op: 'limit'; count: number; }
export interface JoinStep { op: 'join'; left: string; right: string; on: { left: string; right: string }[]; joinType?: 'inner' | 'left'; }
export interface AggregateStep { op: 'aggregate'; groupBy: string[]; metrics: { field: string; fn: 'sum' | 'avg' | 'min' | 'max' | 'count' }[]; }

export type TransformStep = FilterStep | MapStep | LimitStep | JoinStep | AggregateStep;

// Result categorization
export interface TransformValidationResult {
  valid: TransformStep[];
  legacy: any[]; // steps that are kept but not part of the new union (e.g., pickFields)
  invalid: { index: number; step: any; reason: string }[];
}

export function validateTransformSteps(raw: any[]): TransformValidationResult {
  const result: TransformValidationResult = { valid: [], legacy: [], invalid: [] };
  if (!Array.isArray(raw)) return result;
  raw.forEach((step, idx) => {
    if (!step || typeof step !== 'object') {
      result.invalid.push({ index: idx, step, reason: 'not-an-object' });
      return;
    }
    const op = step.op;
    switch (op) {
      case 'filter':
        if (step.expr && typeof step.expr === 'object' && !Array.isArray(step.expr)) {
          result.valid.push(step as FilterStep);
        } else result.invalid.push({ index: idx, step, reason: 'filter-missing-expr' });
        break;
      case 'map':
        if (typeof step.expr === 'string') result.valid.push(step as MapStep); else result.invalid.push({ index: idx, step, reason: 'map-missing-expr' });
        break;
      case 'limit':
        if (typeof step.count === 'number') result.valid.push(step as LimitStep); else result.invalid.push({ index: idx, step, reason: 'limit-missing-count' });
        break;
      case 'join':
        if (typeof step.left === 'string' && typeof step.right === 'string' && Array.isArray(step.on)) result.valid.push(step as JoinStep); else result.invalid.push({ index: idx, step, reason: 'join-malformed' });
        break;
      case 'aggregate':
        if (Array.isArray(step.groupBy) && Array.isArray(step.metrics)) result.valid.push(step as AggregateStep); else result.invalid.push({ index: idx, step, reason: 'aggregate-malformed' });
        break;
      default:
        // Legacy passthrough (e.g., pickFields) retained so existing pipelines keep working
        result.legacy.push(step);
    }
  });
  return result;
}
