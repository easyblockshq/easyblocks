import { deepClone } from "@easyblocks/utils";

export type Rows = Array<Array<number>>;

export function findFirstItemInRows(rows: Rows, itemIndex: number) {
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    if (rows[rowIndex] === null || rows[rowIndex] === undefined) {
      continue;
    }

    for (let colIndex = 0; colIndex < rows[rowIndex].length; colIndex++) {
      if (rows[rowIndex][colIndex] === itemIndex) {
        return {
          row: rowIndex,
          col: colIndex,
        };
      }
    }
  }
}

export function buildRows(
  cardStyles: any[],
  isSlider: boolean,
  numberOfItems: number
): Rows {
  let rows: Array<Array<number>> = [];

  if (isSlider) {
    rows.push([]);
    cardStyles.forEach((card: any, index: number) => {
      rows[0].push(index);
    });
  } else {
    // First fill the 2x1 cards, then fill the rest
    cardStyles.forEach((card: any, index: number) => {
      if (
        numberOfItems >= 2 &&
        (card.itemSize === "2x1" || card.itemSize === "2x2")
      ) {
        // Below we find where current 2x1 / 2x2 element would be currently placed if it was 1x1
        const filled = fillRowsWithUnplacedCardsWith1x1Size(
          cardStyles,
          numberOfItems,
          rows
        );

        let { row, col } = findFirstItemInRows(filled, index)!;

        if (col === numberOfItems - 1) {
          col = 0;
          row++;
        }

        if (!rows[row]) {
          rows[row] = [];
        }

        rows[row][col] = index;
        rows[row][col + 1] = index;

        if (card.itemSize === "2x2") {
          if (!rows[row + 1]) {
            rows[row + 1] = [];
          }
          rows[row + 1][col] = index;
          rows[row + 1][col + 1] = index;
        }
      }
    });

    rows = fillRowsWithUnplacedCardsWith1x1Size(
      cardStyles,
      numberOfItems,
      rows
    );
  }

  return rows;
}

function fillRowsWithUnplacedCardsWith1x1Size(
  cardStyles: any[],
  numberOfItems: number,
  inputRows: Rows
) {
  const rows = deepClone(inputRows);

  cardStyles.forEach((card: any, index: number) => {
    if (findFirstItemInRows(rows, index)) {
      return;
    }

    for (let row = 0; row < 999; row++) {
      if (rows[row]) {
        let isFull = true;

        for (let col = 0; col < numberOfItems; col++) {
          if (rows[row][col] === undefined || rows[row][col] === null) {
            rows[row][col] = index;
            isFull = false;
            break;
          }
        }

        if (isFull) {
          continue;
        } else {
          break;
        }
      } else {
        rows[row] = [index];
        break;
      }
    }
  });

  return rows;
}

export type ItemPosition = {
  isFirstRow: boolean;
  isLastRow: boolean;
  isFirstColumn: boolean;
  isLastColumn: boolean;
};

export function buildItemPositions(
  rows: Rows,
  length: number,
  itemsInRow: number
) {
  const itemPositions: ItemPosition[] = [];

  for (let i = 0; i < length; i++) {
    itemPositions.push({
      isFirstRow: false,
      isFirstColumn: false,
      isLastColumn: false,
      isLastRow: false,
    });
  }

  rows.forEach((row, index) => {
    if (index === 0) {
      row.forEach((itemIndex) => {
        if (itemIndex === null || itemIndex === undefined) {
          return;
        }

        itemPositions[itemIndex].isFirstRow = true;
      });
    }

    if (index === rows.length - 1) {
      row.forEach((itemIndex) => {
        if (itemIndex === null || itemIndex === undefined) {
          return;
        }

        itemPositions[itemIndex].isLastRow = true;
      });
    }

    row.forEach((itemIndex, colIndex) => {
      if (itemIndex === null || itemIndex === undefined) {
        return;
      }

      if (colIndex === 0) {
        itemPositions[itemIndex].isFirstColumn = true;
      }
      if (colIndex === itemsInRow - 1) {
        itemPositions[itemIndex].isLastColumn = true;
      }
    });
  });

  return itemPositions;
}
