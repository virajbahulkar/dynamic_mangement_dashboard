import * as yup from "yup";

export function createYupSchema(schema, config) {
  const { id, validationType, validations = [], showWhen, when } = config;
  if (!yup[validationType]) {
    return schema;
  }
  let validator = yup[validationType]();
  validations.forEach((validation) => {
    const { params, type } = validation;
    if (!validator[type] || !params) {
      return;
    }
    validator = validator[type](...params);
  });
  // Conditional validation: when/showWhen support
  const cond = when || showWhen;
  if (cond && cond.field) {
    const dep = String(cond.field);
    const isMatch = (val) => {
      if (Object.prototype.hasOwnProperty.call(cond, 'equals')) return val === cond.equals;
      if (Object.prototype.hasOwnProperty.call(cond, 'notEquals')) return val !== cond.notEquals;
      if (Array.isArray(cond.in)) return cond.in.includes(val);
      if (Array.isArray(cond.notIn)) return !cond.notIn.includes(val);
      return Boolean(val);
    };
    const thenValidators = Array.isArray(cond.then)
      ? cond.then
      : []; // e.g., [{ type:'required', params:['Required'] }]
    const applyThen = (base) => thenValidators.reduce((acc, v) => {
      const { type, params } = v || {};
      if (type && typeof base[type] === 'function') return base[type](...(params || []));
      return acc;
    }, base);
    validator = validator.when(dep, {
      is: (val) => isMatch(val),
      then: (sch) => applyThen(sch),
      otherwise: (sch) => sch,
    });
  }
  schema[id] = validator;
  return schema;
}
