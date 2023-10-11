// IFFE to initiate game board and associated actions. 
const gameBoard = function() {

    /* Create board as a 2d array - this will  allow any cell to be 
     identified by board[column][row] */
    const board =  [["X", "O", "X"],
                    ["O", "", "X"],
                    ["X", "X", "O"]];

    const getBoard = () => board;

    const addPlayerMove = (playerSymbol, column, row) => {
        // Check if the move is valid by confirming the cell is empty.
        if (!board[row][column]) {
            board[row][column] = playerSymbol;
        }
    }

    const printBoard = () => {
        for (let rowN = 0; rowN < 3; rowN++) {
            for (let columnN = 0; columnN < 3; columnN++)
            {
                // Get the gameboard cell for the associated row/column numbers. Add 1 to account for zero indexing of array.
                const cell = document.querySelector(`.cell[data-row="${rowN+1}"][data-column="${columnN+1}"]`);
                cell.textContent = board[rowN][columnN];
            }
        }
    }

    return {board, getBoard, addPlayerMove, printBoard};
}()


function createPlayer(name, symbol) {
    let score = 0;

    const getName = () => name;
    const getSymbol = () => symbol;
    const incrementScore = () => score++;
    const getScore = () => score;

    return {getName, getSymbol, incrementScore, getScore};
}

function gameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    // Create the players.
    const playerOne = createPlayer(playerOneName, "O");
    const playerTwo = createPlayer(playerTwoName, "X");

    return {playerOne, playerTwo};
}