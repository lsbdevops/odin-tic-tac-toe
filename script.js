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
        if (!board[column][row]) {
            board[column][row] = playerSymbol;
        }
    }

    return {board, getBoard, addPlayerMove};
}()

function createPlayer(name, symbol) {
    const getName = () => name;
    const getSymbol = () => symbol;

    return {getName, getSymbol};
}

function gameController(playerOneName = "Player One", playerTwoName = "Player Two") {
    // Create the players.
    const playerOne = createPlayer(playerOneName, "O");
    const playerTwo = createPlayer(playerTwoName, "X");

    return {playerOne, playerTwo};
}