const gameBoard = function() {
    const board =  [["X", "O", "X"],
                    ["O", "O", "X"],
                    ["X", "X", "O"]];

    const getBoard = () => board;
    
    return {board, getBoard};
}()