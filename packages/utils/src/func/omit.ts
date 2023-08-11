import { entries } from "../object";

function omit<
  Value extends Record<string, any>,
  OmittedKeys extends keyof Value
>(value: Value, omittedKeys: Array<OmittedKeys>): Omit<Value, OmittedKeys> {
  const filteredEntries = entries(value).filter((entry) => {
    return !omittedKeys.includes(entry[0] as OmittedKeys);
  });

  return Object.fromEntries(filteredEntries) as Omit<Value, OmittedKeys>;
}

export { omit };
