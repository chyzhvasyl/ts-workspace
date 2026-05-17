// Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:
//
// Each row must contain the digits 1-9 without repetition.
// Each column must contain the digits 1-9 without repetition.
// Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.
// Note:
//
// A Sudoku board (partially filled) could be valid but is not necessarily solvable.
// Only the filled cells need to be validated according to the mentioned rules.
//
//
// Example 1:
//
//
// Input: board =
// [["5","3",".",".","7",".",".",".","."]
// ,["6",".",".","1","9","5",".",".","."]
// ,[".","9","8",".",".",".",".","6","."]
// ,["8",".",".",".","6",".",".",".","3"]
// ,["4",".",".","8",".","3",".",".","1"]
// ,["7",".",".",".","2",".",".",".","6"]
// ,[".","6",".",".",".",".","2","8","."]
// ,[".",".",".","4","1","9",".",".","5"]
// ,[".",".",".",".","8",".",".","7","9"]]
// Output: true
// Example 2:
//
// Input: board =
// [["8","3",".",".","7",".",".",".","."]
// ,["6",".",".","1","9","5",".",".","."]
// ,[".","9","8",".",".",".",".","6","."]
// ,["8",".",".",".","6",".",".",".","3"]
// ,["4",".",".","8",".","3",".",".","1"]
// ,["7",".",".",".","2",".",".",".","6"]
// ,[".","6",".",".",".",".","2","8","."]
// ,[".",".",".","4","1","9",".",".","5"]
// ,[".",".",".",".","8",".",".","7","9"]]
// Output: false
// Explanation: Same as Example 1, except with the 5 in the top left corner being modified to 8.
// Since there are two 8's in the top left 3x3 sub-box, it is invalid.
//
//
// Constraints:
//
// board.length == 9
// board[i].length == 9
// board[i][j] is a digit 1-9 or '.'.

const BOARD_DIMENSION = 9;
const MAX_NUMBER = '9';
const MIN_NUMBER = '1';
const EMPTY_VALUE = '.';
const BOX_SIZE = 3;

// ================================================================

const isSudokuItemValid = (item: string): boolean =>
  item === EMPTY_VALUE ||
  (Number(item) >= Number(MIN_NUMBER) && Number(item) <= Number(MAX_NUMBER));

const areSudokuItemsValid = (board: string[][] = []): boolean =>
  board.every((row: string[]) => row.every((item: string) => isSudokuItemValid(item)));

const isSudokuBoardSize = (board: string[][] = []): boolean =>
  board.length === BOARD_DIMENSION &&
  board.every((row: string[]) => row.length === BOARD_DIMENSION);

const isSudokuBoard = (board: string[][] = []): boolean =>
  isSudokuBoardSize(board) && areSudokuItemsValid(board);

// ================================================================

const getRowByIndex = (board: string[][] = [], i: number): string[] => board[i];

const getColumnByIndex = (board: string[][] = [], i: number): string[] =>
  board.map((row: string[]) => row[i]);

const getBoxByIndex = (board: string[][] = [], sectorIndex: number): string[] => {
  const defineStartingRow = (sectorIndex: number, startingRowIndex = 0): number => {
    if (sectorIndex - BOX_SIZE >= 0) {
      return defineStartingRow(sectorIndex - BOX_SIZE, startingRowIndex + 1);
    }

    return startingRowIndex;
  };

  const defineStartingColumn = (sectorIndex: number, startingColumnIndex = 0): number => {
    const diff = sectorIndex - BOX_SIZE;

    if (diff < 0) {
      return BOX_SIZE * sectorIndex;
    }

    return defineStartingColumn(diff, startingColumnIndex + BOX_SIZE);
  };

  const getBoxStartingCoordinates = (row: number, column: number): number[] => [
    row * BOX_SIZE,
    column,
  ];

  const buildSectorBox = (
    board: string[][] = [],
    startingCoordinates: number[] = [],
  ): string[] => {
    const box: string[] = [];
    const [row, column] = startingCoordinates;

    for (let i = 0; i < BOX_SIZE; i++) {
      box.push(...board[row + i].slice(column, column + BOX_SIZE));
    }

    return box;
  };

  return buildSectorBox(
    board,
    getBoxStartingCoordinates(
      defineStartingRow(sectorIndex),
      defineStartingColumn(sectorIndex),
    ),
  );
};

const getNumbers = (arr: string[] = []): string[] =>
  arr.filter((item: string) => item !== EMPTY_VALUE);

const hasDuplicates = (arr: string[] = []): boolean =>
  arr.some((item: string, index: number, arr: string[]) => index !== arr.indexOf(item));

const isRowValid = (row: string[] = []): boolean => !hasDuplicates(getNumbers(row));

const isColumnValid = (column: string[] = []): boolean =>
  !hasDuplicates(getNumbers(column));

const isBoxValid = (box: string[] = []): boolean => !hasDuplicates(getNumbers(box));

export const isValidSudoku = (board: string[][]): boolean => {
  if (!isSudokuBoard(board)) return false;

  for (let i = 0; i < BOARD_DIMENSION; i++) {
    if (
      !isRowValid(getRowByIndex(board, i)) ||
      !isColumnValid(getColumnByIndex(board, i)) ||
      !isBoxValid(getBoxByIndex(board, i))
    ) {
      return false;
    }
  }

  return true;
};

// approved
