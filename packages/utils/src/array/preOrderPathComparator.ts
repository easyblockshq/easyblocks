const takeNumbers = (path: string) =>
  path
    .split(".")
    .map((x) => parseInt(x, 10))
    .filter((x) => !Number.isNaN(x));

const preOrderPathComparator =
  (direction: "ascending" | "descending" = "ascending") =>
  (pathA: string, pathB: string) => {
    const order = direction === "ascending" ? 1 : -1;

    const numbersA = takeNumbers(pathA);
    const numbersB = takeNumbers(pathB);

    const numberALength = numbersA.length;
    const numberBLength = numbersB.length;

    if (numberALength === 0 || numberBLength === 0) {
      throw new Error(`Cannot compare paths '${pathA}' and '${pathB}'.`);
    }

    const shorterLength = Math.min(numberALength, numberBLength);
    let index = 0;
    while (index < shorterLength) {
      const valueA = numbersA[index];
      const valueB = numbersB[index];
      if (valueA !== valueB) {
        return order * Math.sign(valueA - valueB);
      }
      index++;
    }

    return order * Math.sign(numberBLength - numberALength);
  };

export { preOrderPathComparator };
