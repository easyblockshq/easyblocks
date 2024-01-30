import test from "ava";

import { reduceCSSCalc } from "..";

function testFixture(t, fixture, expected = null, precision = 5, map = {}) {
  if (expected === null) expected = fixture;

  const out = reduceCSSCalc(fixture, precision, map);
  t.deepEqual(out, expected);
}

function testThrows(t, fixture, expected, precision = 5, map = {}) {
  t.throws(() => reduceCSSCalc(fixture, precision), expected, map);
}

// vw
test(
  "(vw) max should work",
  testFixture,
  "calc(max(calc(10px+30vw),20vw)+20px)",
  "60px",
  5,
  { vw: 100 }
);
test(
  "(vw) max should work 2",
  testFixture,
  "calc(max(calc(10px+30vw),20vw)+20px)",
  "90px",
  5,
  { vw: 200 }
);
test(
  "(vw) max with nonpx throws",
  testThrows,
  "calc(max(10px, 10em))",
  "Max function can be reduced only if types are LengthValue",
  5,
  { vw: 100 }
);

test(
  "(vw) min should work",
  testFixture,
  "calc(min(calc(10px+30vw),20vw)+20px)",
  "40px",
  5,
  { vw: 100 }
);
test(
  "(vw) min should work 2",
  testFixture,
  "calc(min(calc(10px+30vw),20vw)+20px)",
  "22px",
  5,
  { vw: 10 }
);
test(
  "(vw) max with nonpx throws",
  testThrows,
  "calc(min(10px, 10em))",
  "Min function can be reduced only if types are LengthValue",
  5,
  { vw: 100 }
);

// percent
test(
  "(percent) max should work",
  testFixture,
  "calc(max(calc(10px+30%),20%)+20px)",
  "60px",
  5,
  { percent: 100 }
);
test(
  "(percent) max should work 2",
  testFixture,
  "calc(max(calc(10px+30%),20%)+20px)",
  "90px",
  5,
  { percent: 200 }
);
test(
  "(percent) max with nonpx throws",
  testThrows,
  "calc(max(10px, 10em))",
  "Max function can be reduced only if types are LengthValue",
  5,
  { percent: 100 }
);

test(
  "(percent) min should work",
  testFixture,
  "calc(min(calc(10px+30%),20%)+20px)",
  "40px",
  5,
  { percent: 100 }
);
test(
  "(percent) min should work 2",
  testFixture,
  "calc(min(calc(10px+30%),20%)+20px)",
  "22px",
  5,
  { percent: 10 }
);
test(
  "(percent) max with nonpx throws",
  testThrows,
  "calc(min(10px, 10em))",
  "Min function can be reduced only if types are LengthValue",
  5,
  { percent: 100 }
);

test("should reduce simple calc (1)", testFixture, "calc(1px + 1px)", "2px");

test("should reduce simple calc (2)", testFixture, "calc(3em - 1em)", "2em");

test(
  "should reduce simple calc (3)",
  testFixture,
  "calc(1rem * 1.5)",
  "1.5rem"
);

test("should reduce simple calc (4)", testFixture, "calc(2ex / 2)", "1ex");

test(
  "should reduce simple calc (5)",
  testFixture,
  "calc(50px - (20px - 30px))",
  "60px"
);

test(
  "should reduce simple calc (6)",
  testFixture,
  "calc(100px - (100px - 100%))",
  "100%"
);

test(
  "should reduce simple calc (7)",
  testFixture,
  "calc(100px + (100px - 100%))",
  "calc(200px - 100%)"
);

test(
  "should reduce additions and subtractions (1)",
  testFixture,
  "calc(100% - 10px + 20px)",
  "calc(100% + 10px)"
);

test(
  "should reduce additions and subtractions (2)",
  testFixture,
  "calc(100% + 10px - 20px)",
  "calc(100% - 10px)"
);

test("should handle fractions", testFixture, "calc(10.px + .0px)", "10px");

test(
  "should ignore value surrounding calc function (1)",
  testFixture,
  "a calc(1px + 1px)",
  "a 2px"
);

test(
  "should ignore value surrounding calc function (2)",
  testFixture,
  "calc(1px + 1px) a",
  "2px a"
);

test(
  "should ignore value surrounding calc function (3)",
  testFixture,
  "a calc(1px + 1px) b",
  "a 2px b"
);

test(
  "should ignore value surrounding calc function (4)",
  testFixture,
  "a calc(1px + 1px) b calc(1em + 2em) c",
  "a 2px b 3em c"
);

test(
  "should reduce nested calc",
  testFixture,
  "calc(100% - calc(50% + 25px))",
  "calc(50% - 25px)"
);

test(
  "should reduce prefixed nested calc",
  testFixture,
  "-webkit-calc(100% - -webkit-calc(50% + 25px))",
  "-webkit-calc(50% - 25px)"
);

test(
  "should ignore calc with css variables (1)",
  testFixture,
  "calc(var(--mouseX) * 1px)"
);

test(
  "should ignore calc with css variables (2)",
  testFixture,
  "calc(10px - (100px * var(--mouseX)))",
  "calc(10px - 100px * var(--mouseX))"
);

test(
  "should ignore calc with css variables (3)",
  testFixture,
  "calc(10px - (100px + var(--mouseX)))",
  "calc(-90px - var(--mouseX))"
);

test(
  "should ignore calc with css variables (4)",
  testFixture,
  "calc(10px - (100px / var(--mouseX)))",
  "calc(10px - 100px / var(--mouseX))"
);

test(
  "should ignore calc with css variables (5)",
  testFixture,
  "calc(10px - (100px - var(--mouseX)))",
  "calc(-90px + var(--mouseX))"
);

test(
  "should ignore calc with css variables (6)",
  testFixture,
  "calc(var(--popupHeight) / 2)",
  "calc(var(--popupHeight) / 2)"
);

test(
  "should ignore calc with css variables (7)",
  testFixture,
  "calc(var(--popupHeight, var(--defaultHeight, var(--height-150))) / 2)",
  "calc(var(--popupHeight, var(--defaultHeight, var(--height-150))) / 2)"
);

test(
  "should ignore calc with css variables (8)",
  testFixture,
  "calc(var(--popupHeight, var(--defaultHeight, calc(100% - 50px))) / 2)",
  "calc(var(--popupHeight, var(--defaultHeight, calc(100% - 50px))) / 2)"
);

test(
  "should ignore calc with css variables (9)",
  testFixture,
  "calc(var(--popupHeight, var(--defaultHeight, calc(100% - 50px + 25px))) / 2)",
  "calc(var(--popupHeight, var(--defaultHeight, calc(100% - 25px))) / 2)"
);

test(
  "should ignore calc with css variables (10)",
  testFixture,
  "calc(var(--popupHeight, var(--defaultHeight, 150px)) / 2)",
  "calc(var(--popupHeight, var(--defaultHeight, 150px)) / 2)"
);

test(
  "should reduce calc with newline characters",
  testFixture,
  "calc(\n1rem \n* 2 \n* 1.5)",
  "3rem"
);

test(
  "should preserve calc with incompatible units",
  testFixture,
  "calc(100% + 1px)",
  "calc(100% + 1px)"
);

test(
  "should parse fractions without leading zero",
  testFixture,
  "calc(2rem - .14285em)",
  "calc(2rem - 0.14285em)"
);

test(
  "should handle precision correctly (1)",
  testFixture,
  "calc(1/100)",
  "0.01"
);

test(
  "should handle precision correctly (2)",
  testFixture,
  "calc(5/1000000)",
  "0.00001"
);

test(
  "should handle precision correctly (3)",
  testFixture,
  "calc(5/1000000)",
  "0.000005",
  6
);

test(
  "should reduce browser-prefixed calc (1)",
  testFixture,
  "-webkit-calc(1px + 1px)",
  "2px"
);

test(
  "should reduce browser-prefixed calc (2)",
  testFixture,
  "-moz-calc(1px + 1px)",
  "2px"
);

test(
  "should discard zero values (#2) (1)",
  testFixture,
  "calc(100vw / 2 - 6px + 0px)",
  "calc(50vw - 6px)"
);

test(
  "should discard zero values (#2) (2)",
  testFixture,
  "calc(500px - 0px)",
  "500px"
);

test(
  "should not perform addition on unitless values (#3)",
  testFixture,
  "calc(1px + 1)",
  "calc(1px + 1)"
);

test(
  "should reduce consecutive substractions (#24) (1)",
  testFixture,
  "calc(100% - 120px - 60px)",
  "calc(100% - 180px)"
);

test(
  "should reduce consecutive substractions (#24) (2)",
  testFixture,
  "calc(100% - 10px - 20px)",
  "calc(100% - 30px)"
);

test(
  "should produce simpler result (postcss-calc#25) (1)",
  testFixture,
  "calc(14px + 6 * ((100vw - 320px) / 448))",
  "calc(9.71px + 1.34vw)",
  2
);

test(
  "should produce simpler result (postcss-calc#25) (2)",
  testFixture,
  "-webkit-calc(14px + 6 * ((100vw - 320px) / 448))",
  "-webkit-calc(9.71px + 1.34vw)",
  2
);

test(
  "should reduce mixed units of time (postcss-calc#33)",
  testFixture,
  "calc(1s - 50ms)",
  "0.95s"
);

test(
  "should correctly reduce calc with mixed units (cssnano#211)",
  testFixture,
  "bar:calc(99.99% * 1/1 - 0rem)",
  "bar:99.99%"
);

test(
  "should apply algebraic reduction (cssnano#319)",
  testFixture,
  "bar:calc((100px - 1em) + (-50px + 1em))",
  "bar:50px"
);

test(
  "should apply optimization (cssnano#320)",
  testFixture,
  "bar:calc(50% + (5em + 5%))",
  "bar:calc(55% + 5em)"
);

test(
  "should throw an exception when attempting to divide by zero",
  testThrows,
  "calc(500px/0)",
  /Cannot divide by zero/
);

test(
  "should throw an exception when attempting to divide by unit (#1)",
  testThrows,
  "calc(500px/2px)",
  'Cannot divide by "px", number expected'
);

test(
  "should reduce substraction from zero",
  testFixture,
  "calc( 0 - 10px)",
  "-10px"
);

test(
  "should reduce subtracted expression from zero",
  testFixture,
  "calc( 0 - calc(1px + 1em) )",
  "calc(-1px + -1em)"
);

test(
  "should reduce nested expression",
  testFixture,
  "calc( (1em - calc( 10px + 1em)) / 2)",
  "-5px"
);

test(
  "should skip constant()",
  testFixture,
  "calc(constant(safe-area-inset-left))",
  "calc(constant(safe-area-inset-left))"
);

test(
  "should skip env()",
  testFixture,
  "calc(env(safe-area-inset-left))",
  "calc(env(safe-area-inset-left))"
);

test(
  "should handle subtractions with different units",
  testFixture,
  "calc(100% - calc(666px + 1em + 2em + 100px))",
  "calc(100% - 766px - 3em)"
);
