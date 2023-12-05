import valueParser from "postcss-value-parser";
import { parser } from "./parser"; // eslint-disable-line
import { reducer } from "./lib/reducer";
import { stringifier } from "./lib/stringifier";

const MATCH_CALC = /((?:\-[a-z]+\-)?calc)/;

function calculateAllViewportValues(ast, map) {
  if (typeof ast === "object" && ast !== null) {
    if (
      ast.type === "VwValue" &&
      ast.unit === "vw" &&
      typeof map.vw === "number"
    ) {
      return {
        type: "LengthValue",
        unit: "px",
        value: (ast.value / 100) * map.vw,
      };
    } else if (
      ast.type === "PercentageValue" &&
      ast.unit === "%" &&
      typeof map.percent === "number"
    ) {
      return {
        type: "LengthValue",
        unit: "px",
        value: (ast.value / 100) * map.percent,
      };
    } else {
      for (const key in ast) {
        if (typeof ast[key] === "object" && ast[key] !== null) {
          ast[key] = calculateAllViewportValues(ast[key], map);
        }
      }
    }
  }
  return ast;
}

export function reduceCSSCalc(value, precision = 5, map = {}) {
  return valueParser(value)
    .walk((node) => {
      // skip anything which isn't a calc() function
      if (node.type !== "function" || !MATCH_CALC.test(node.value)) return;

      // stringify calc expression and produce an AST
      const contents = valueParser.stringify(node.nodes);

      // skip constant() and env()
      if (contents.indexOf("constant") >= 0 || contents.indexOf("env") >= 0)
        return;

      const ast = calculateAllViewportValues(parser.parse(contents), map);

      // reduce AST to its simplest form, that is, either to a single value
      // or a simplified calc expression
      const reducedAst = reducer(ast, precision, map);

      // stringify AST and write it back
      node.type = "word";
      node.value = stringifier(node.value, reducedAst, precision);
    }, true)
    .toString();
}
