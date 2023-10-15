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

            // Confirm valid move has been made.
            return true;
        }

        return false;
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

    return {addPlayerMove, printBoard, getBoard};
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
    let turnDisplay = document.querySelector("#turn");
    turnDisplay.textContent = `${activePlayer.getName()} (${activePlayer.getSymbol()})`;

    // Change the active player.
    const changePlayerTurn = () => {
        activePlayer = (activePlayer === playerOne) ? playerTwo : playerOne;
        turnDisplay.textContent = `${activePlayer.getName()} (${activePlayer.getSymbol()})`;
    }

    const getActivePlayer = () => activePlayer;

    const playRound = () => {
        // Get list of all cells and add a click event listener to each.
        const cellList = document.querySelectorAll(".cell");

        cellList.forEach((cell) => {
            cell.addEventListener("click", () => {
                const player = getActivePlayer();
                const playerSymbol = player.getSymbol();
                let isMoveValid = false;

                // Confirm player's move is valid before continuing.
                isMoveValid = gameBoard.addPlayerMove(playerSymbol, cell.dataset.column - 1, cell.dataset.row - 1);

                // Add symbol of active player to the clicked cell. Minus 1 to account for zero indexing of array.
                if (!isMoveValid) {
                   return;
                }

                // Re-print the game board to render the player's selection.
                gameBoard.printBoard();
                
                // Check if the active player has won.
                if (checkForWinner(playerSymbol)) {
                    printWinner(player.getName());
                    player.incrementScore();
                }
                else if (checkForDraw()) {
                    printDraw();
                }

                // Change the active player.
                changePlayerTurn();
            })
        })
    }

    const checkForWinner = (playerSymbol) => {
        let isWinner = false;
        const currentBoard = gameBoard.getBoard();

        const isThreeInRow = (currentSymbol) => currentSymbol === playerSymbol;

        // Check for winner in rows and diagonal.
        diagonalArray1 = [];
        diagonalArray2 = [];
        for (let row = 0; row < 3; row++) {
            if (currentBoard[row].every(isThreeInRow)) {
                isWinner = true;
            }

            diagonalArray1.push(currentBoard[row][row]);
            diagonalArray2.push(currentBoard[row][2 - row]);
        }

        if (diagonalArray1.every(isThreeInRow) || diagonalArray2.every(isThreeInRow)) {
            isWinner = true;
        }

        // Check for winner in columns.
        for (let column = 0; column < 3; column++) {
            const columnArray = [];
            for (let row = 0; row < 3; row++) {
                columnArray.push(currentBoard[row][column]);
            }

            if (columnArray.every(isThreeInRow)) {
                isWinner = true;
            }
        }

        return isWinner;
    }

    const checkForDraw = () => {
        // Flatten array so that every method will check each array element.
        const currentBoard = gameBoard.getBoard().flat();

        // Get boolean for if the corresponding array index contains a value.
        const containsSymbol = (currentCell) => !!currentCell;

        // Check if all array elements contain a value and return boolean.
        return currentBoard.every(containsSymbol);
    }

    const printWinner = (winner) => {
        document.querySelector("#winner").textContent = `${winner} wins!`;
    }

    const printDraw = () => {
        document.querySelector("#winner").textContent = "Round Drawn!"
    }

    return {playRound};
}

const game = gameController();
game.playRound();