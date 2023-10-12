// IFFE to initiate game board and associated actions. 
const gameBoard = function() {

    /* Create board as a 2d array - this will  allow any cell to be 
     identified by board[column][row] */
    const board =  [["", "", ""],
                    ["", "", ""],
                    ["", "", ""]];

    const getBoard = () => board;

    const addPlayerMove = (playerSymbol, column, row) => {
        // Check if the move is valid by confirming the cell is empty.
        if (!board[row][column]) {
            board[row][column] = playerSymbol;
        }
    }

    const printBoard = () => {
        // Loop for each cell of the 3x3 grid.
        for (let rowN = 0; rowN < 3; rowN++) {
            for (let columnN = 0; columnN < 3; columnN++)
            {
                // Get the gameboard cell for the associated row/column numbers. Add 1 to account for zero indexing of array.
                const cell = document.querySelector(`.cell[data-row="${rowN+1}"][data-column="${columnN+1}"]`);
                cell.textContent = board[rowN][columnN];
            }
        }
    }

    return {addPlayerMove, printBoard};
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

    // Set initial player's turn.
    let activePlayer = playerOne;

    // Change the active player.
    const changePlayerTurn = () => {
        activePlayer = (activePlayer === playerOne) ? playerTwo : playerOne;
    }

    const getActivePlayer = () => activePlayer;

    const playRound = () => {
        // Get list of all cells and add a click event listener to each.
        const cellList = document.querySelectorAll(".cell");

        cellList.forEach((cell) => {
            cell.addEventListener("click", () => {
                // Add symbol of active player to the clicked cell. Mins 1 to account for zero indexing of array.
                gameBoard.addPlayerMove(getActivePlayer().getSymbol(), cell.dataset.column - 1, cell.dataset.row - 1);

                // Re-print the game board to render the player's selection.
                gameBoard.printBoard();

                // Change the active player.
                changePlayerTurn();
            })
        })
    }

    return {playRound};
}

const game = gameController();