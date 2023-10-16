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
    
    const resetBoard = () => {
        // Loop for each cell of the 3x3 grid.
        for (let rowN = 0; rowN < 3; rowN++) {
            for (let columnN = 0; columnN < 3; columnN++)
            {
                // Reset each cell on the gameboard to be empty.
                board[rowN][columnN] = "";
            }
        }
    }

    return {addPlayerMove, printBoard, getBoard, resetBoard};
}()


function createPlayer(name, symbol) {
    let score = 0;

    const getName = () => name;
    const getSymbol = () => symbol;
    const incrementScore = () => score++;
    const getScore = () => score;

    return {getName, getSymbol, incrementScore, getScore};
}

function gameController(playerOneName, playerTwoName) {
    // Create the players.
    const playerOne = createPlayer(playerOneName, "X");
    const playerTwo = createPlayer(playerTwoName, "O");

    // Render player names on the webpage.
    document.querySelector("#p1-name").textContent = playerOne.getName();
    document.querySelector("#p2-name").textContent = playerTwo.getName();

    // Set initial player's turn.
    let activePlayer = playerOne;

    // Change the active player.
    const changePlayerTurn = () => {
        activePlayer = (activePlayer === playerOne) ? playerTwo : playerOne;
        document.querySelector(".player-one").classList.toggle("active");
        document.querySelector(".player-two").classList.toggle("active");
    }

    const getActivePlayer = () => activePlayer;

    const playRound = () => {
        // Declare AbortController to remove event listeners once round is completed.
        const removeListeners = new AbortController();
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
                const [isWinner, winningArray] = checkForWinner(playerSymbol);
                if (isWinner) {
                    printWinner(player.getName(), winningArray);
                    player.incrementScore();
                    printScores();
                    removeListeners.abort();
                }
                else if (checkForDraw()) {
                    printDraw();
                    removeListeners.abort();
                }
                else {
                    // Change the active player to continue the round.
                    changePlayerTurn();
                }
            }, { signal: removeListeners.signal })
        })
    }

    const checkForWinner = (playerSymbol) => {
        const winningArray = [];
        const currentBoard = gameBoard.getBoard();

        const isThreeInRow = (currentSymbol) => currentSymbol === playerSymbol;

        // Declare arrays to store checks for diagonal win conditions.
        diagonalArrayLR = [];
        diagonalArrayRL = [];
        for (let i = 0; i < 3; i++) {
            // Check for winner in row number i.
            if (currentBoard[i].every(isThreeInRow)) {
                // Get coordinates of winning cells (in row).
                for (let j = 0; j < 3; j++) {
                    winningArray.push([i, j])
                }
                return [true, winningArray];
            }

            // Check for winner in column number i.
            const columnArray = [];
            for (let j = 0; j < 3; j++) {
                columnArray.push(currentBoard[j][i]);
            }
            if (columnArray.every(isThreeInRow)) {
                // Get coordinates of winning cells (in column).
                for (let k = 0; k < 3; k++) {
                    winningArray.push([k, i]);
                }
                return [true, winningArray];
            }

            diagonalArrayLR.push(currentBoard[i][i]);
            diagonalArrayRL.push(currentBoard[i][2 - i]);
        }

        // Check diagonal conditions for winner - return the coordinates of winning diagonal.
        if (diagonalArrayLR.every(isThreeInRow)) {
            return [true, [[0,0], [1,1], [2,2]]]
        }
        if (diagonalArrayRL.every(isThreeInRow)) {
            return [true, [[0,2], [1,1], [2,0]]]
        }

        // If there is no winner.
        return [false, winningArray];
    }

    const checkForDraw = () => {
        // Flatten array so that every method will check each array element.
        const currentBoard = gameBoard.getBoard().flat();

        // Get boolean for if the corresponding array index contains a value.
        const containsSymbol = (currentCell) => !!currentCell;

        // Check if all array elements contain a value and return boolean.
        return currentBoard.every(containsSymbol);
    }

    const printWinner = (winner, winningArray) => {
        document.querySelector("#announce-winner").showModal();
        document.querySelector("#winner").textContent = `${winner} wins!`;
        for (coordinate of winningArray) {
            document.querySelector(`.cell[data-row="${coordinate[0] + 1}"][data-column="${coordinate[1] + 1}"]`)
            .classList.add("win");
        }
    }

    const printDraw = () => {
        document.querySelector("#announce-winner").showModal();
        document.querySelector("#winner").textContent = "Round Drawn!"
    }

    const printScores = () => {
        document.querySelector("#p1-score").textContent = playerOne.getScore();
        document.querySelector("#p2-score").textContent = playerTwo.getScore();
    }

    const resetRound = () => {
        // Reset the gameboard.
        gameBoard.resetBoard();
        gameBoard.printBoard();

        // Reset the colour of winning cells.
        const cellList = document.querySelectorAll(".cell");
        cellList.forEach((cell) => {
            cell.classList.remove("win");
        })

        // Reset the active player.
        activePlayer = playerOne;
        document.querySelector(".player-one").classList.add("active");
        document.querySelector(".player-two").classList.remove("active");

        // Close dialog box.
        document.querySelector("#announce-winner").close();

        // Play the next round.
        playRound();
    }

    // Add event listener for resetting a round.
    document.querySelector("#next-round").addEventListener("click", resetRound);

    return {playRound};
}

function startGame() {
    const dialogElement = document.querySelector("#player-info");
    const playButton = document.querySelector("#play");
    const playerNames = {};

    dialogElement.showModal();

    playButton.addEventListener("click", (e) => {
        e.preventDefault();
        playerNames["playerOneName"] = document.querySelector("#name-player-one").value; 
        playerNames["playerTwoName"] = document.querySelector("#name-player-two").value;
        dialogElement.close();

        // Set default names.
        if (!playerNames.playerOneName) {
            playerNames.playerOneName = "Player One";
        }
        if (!playerNames.playerTwoName) {
            playerNames.playerTwoName = "Player Two";
        }

        const game = gameController(playerNames.playerOneName, playerNames.playerTwoName);
        game.playRound();
    })
}

startGame();