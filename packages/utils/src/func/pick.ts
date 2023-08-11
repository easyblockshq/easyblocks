function pick<Prop extends string>(prop: Prop) {
  return function pickPropFromValue<Value extends Record<string, unknown>>(
    value: Value
  ): Value[Prop] {
    return value[prop];
  };
}
export { pick };
