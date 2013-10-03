var gCanvas,        // the canvas element
    gCanvasContext, // the canvas context
    gStatusElement, // the HTML element that displays the game status
    gNewGameElement,// the HTML element that starts a new game
    board,          // the game board state (array of Cell objects)
    numCells,       // the number of cells the board contains
    isRunning,      // is the game still running? (boolean)
    currentPlayer;  // the current player value (1 or 2)

var boardWidth  = 8,    // number of columns on the board
    boardHeight = 8,    // number of rows on the board
    diskWidth   = 40,   // the width of the player disks
    diskHeight  = 40,   // the height of the player disks
    pixelWidth  = 1 + (boardWidth * diskWidth), // the width of the game canvas in pixels
    pixelHeight = 1 + (boardWidth * diskHeight),// the height of the game canvas in pixels
    boardStrokeStyle = '#000000',
    boardFillStyle = '#CAE3D1',
    player1FillStyle = '#000000',
    player1StrokeStyle = '#000000',
    player2FillStyle = '#ffffff',
    player2StrokeStyle = '#000000';

/**
 * Represents a board cell containing a row, column, and player state. If the state is 0, no player occupies the 
 * cell. If a state of 1 or 2, the respective player occupies that space.
 * @param int row The board row the Cell is on.
 * @param int column The board column the Cell is on.
 * @param int state The player state of the column. 0: No one occupies the cell; 1: Player 1 occupies the cell; 2:
 * Player 2 occupies the cell.
 */
function Cell(row, column, state) {        
    this.row    = row;
    this.column = column;
    this.state  = state;
} // end Cell

/**
 * Returns the index of a board cell.
 * @return int The index of the board cell.
 */
function getCursorPosition(e) {
    var x, y;

    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    x -= gCanvasElement.offsetLeft;
    y -= gCanvasElement.offsetTop;
    x = Math.min(x, boardWidth * diskWidth);
    y = Math.min(y, boardHeight * diskHeight);

    var cell = new Cell(Math.floor(y/diskHeight), Math.floor(x/diskWidth), 0);

    for (var i = 0; i < numCells; ++i) {
        if (board[i].row == cell.row && board[i].column == cell.column) {
            return i;
        }
    }
    
    return -1;
}

/**
 * Event handler for the canvas's click event.
 */
function gCanvasOnClick(e) {
    // get the cell that the player clicked on
    var cellIndex = getCursorPosition(e);

    // if the cell is not empty, return without doing anything
    if (board[cellIndex].state != 0) {
        return;
    }

    // if the cell is empty, run the clickOnEmptyCell function
    clickOnEmptyCell(cellIndex);
}

/**
 * Event handler for the canvas's mouse move event.
 */
function gCanvasOnMouseMove(e) {
    // get the cell the mouse is currently in.
    var cellIndex = getCursorPosition(e);  
    
    // make sure the mouse is in bounds of the game board before doing anything.
    if (cellIndex > -1 && cellIndex < numCells) {
        // look to see if the mouse is over a valid move.
        if (isValidMove(cellIndex)) {
            // if so, change the mouse cursor to the pointer to indicate a clickable cell.
            gCanvasElement.style.cursor = 'pointer';
            // drawPossibleMove(board[cellIndex], true);
        }
        else {
            // otherwise, set the cursor back to the default.
            gCanvasElement.style.cursor = 'default';
        }
    }
    else { 
        // if not in bounds, set the cursor back to default in case it was changed last time it was in bounds.
        gCanvasElement.style.cursor = 'default';
    }     
}

/**
 * Gets an array of all the valid moves the current player can make.
 */
function getPlayerMoves() {
    //gStatusElement.innerHTML = '';
    var playerMoves = new Array(),
        opponent = Math.abs(currentPlayer - 2) + 1;

    for (var i = 0; i < numCells; ++i) {

        // if the cell is empty, check for adjacent opponent cells 
        if (board[i].state == 0 && isValidMove(i)) {
            playerMoves.push(i);
        }
    }

    return playerMoves;
}

/**
 * Processes clicks made on empty cells.
 * @param int cellIndex The board index of the cell that was clicked on.
 */
function clickOnEmptyCell(cellIndex) {
    // check to see if the move is valid.
    if (isValidMove(cellIndex)) { 
        gStatusElement.innerHTML += '<br/>Player ' + currentPlayer + 
            ' clicked (' + board[cellIndex].row + ', ' + board[cellIndex].column + ')';   
        // if it is, flip the appropriate disks, etc.
        board[cellIndex].state = currentPlayer;
        flipDisks(cellIndex);

        currentPlayer = Math.abs(currentPlayer - 2) + 1;

        // redraw the board.
        drawBoard();
    }
    else {
        // otherwise, just return
        return;
    }      
}   

/**
 * Checks to see if the current move is valid. The cell must be empty. An adjacent cell must belong to the other 
 * player. A cell that is adjacent to the adjacent cell and in the same direction must belong to the current player.
 */
function isValidMove(cellIndex) {
    if (cellIndex >= numCells) return false;
    
    var rowDiff, colDiff,
        opponent = Math.abs(currentPlayer - 2) + 1;

    for (var i = 0; i < numCells; ++i) {
        if (board[i].state == opponent) {
            // now that we've found one, check in the same direction for one belonging to the current player
            rowDiff = board[i].row - board[cellIndex].row;
            colDiff = board[i].column - board[cellIndex].column;

            if ((rowDiff < 2 && rowDiff > -2 && colDiff < 2 && colDiff > -2) && 
                !(rowDiff == 0 && colDiff == 0)) {

                //gStatusElement.innerHTML += '<br/><br/>isValidMove for (' + board[cellIndex].row + ', ' + board[cellIndex].column + ')';
                // increment the row and column by the differences
                var row = board[i].row + rowDiff,
                    col = board[i].column + colDiff;

                // keep checking until either an empty cell or the end of the board is found.
                while (row < boardHeight && row > -1 && col < boardWidth && col > -1) {
                    for (var j = 0; j < numCells; ++j) {
                        if (board[j].row == row && board[j].column == col) {
                            //gStatusElement.innerHTML += '<br/>Checking (' + row + ', ' + col + ')';
                            row = board[j].row + rowDiff;
                            col = board[j].column + colDiff;

                            if (board[j].state == currentPlayer) {
                                return true;
                            }
                            else if (board[j].state == 0) {
                                row = -1;
                                col = -1;
                            }

                            break;
                        }                                        
                    } // next j                                
                } // end while      
            }                        
        }
    }

    return false;
}

function flipDisks(cellIndex) {
    var rowDiff, colDiff, disksToFlip,
        opponent = Math.abs(currentPlayer - 2) + 1;

    // look for a cell belonging to the opponent
    for (var i = 0; i < numCells; ++i) {
        if (board[i].state == opponent) {
            // now that we've found one, check in the same direction for one belonging to the current player
            rowDiff = board[i].row - board[cellIndex].row;
            colDiff = board[i].column - board[cellIndex].column;

            if ((rowDiff < 2 && rowDiff > -2 && colDiff < 2 && colDiff > -2) && 
                !(rowDiff == 0 && colDiff == 0)) {

                // increment the row and column by the differences
                var row = board[i].row + rowDiff,
                    col = board[i].column + colDiff;

                // add the opponent piece as the first element of the flip array
                disksToFlip = new Array();
                disksToFlip.push(i);

                // keep checking until either an empty cell, a cell owned by the current player or the end of the 
                // board is found.
                while (row < boardHeight && row > -1 && col < boardWidth && col > -1) {
                    for (var j = 0; j < numCells; ++j) {
                        if (board[j].row == row && board[j].column == col) {
                            row = board[j].row + rowDiff;
                            col = board[j].column + colDiff;

                            if (board[j].state == currentPlayer) {
                                // if we find a cell owned by the current player, flip what's in the array
                                var flipLength = disksToFlip.length;

                                for (x = 0; x < flipLength; ++x) {
                                    board[disksToFlip[x]].state = currentPlayer;
                                }
                                row = -1;
                                col = -1;
                                disksToFlip = null;
                            }
                            else if (board[j].state == 0) {
                                // if we find an empty cell, clear the array and break out of the for and while loops
                                row = -1;
                                col = -1;
                                disksToFlip = null;
                            }
                            else {
                                // if we find an opponent cell, add it to the array
                                disksToFlip.push(j);
                            }

                            break;
                        }                                        
                    } // next j                                
                } // end while      
            }                        
        }
    }
}

if (typeof resumeGame != 'function') {
    saveGameState = function() {
        return false;
    };

    resumeGame = function() {
        return false;
    }
}

function isTheGameOver() {
    var moves = getPlayerMoves(),
        numMoves = moves.length;

    if (numMoves == 0) {
        currentPlayer = Math.abs(currentPlayer - 2) + 1;
        moves = getPlayerMoves();
        numMoves = moves.length;

        if (numMoves == 0) {
            return true;
        }
    }

    for (var i = 0; i < numMoves; ++i) {
        drawPossibleMove(board[moves[i]]);
    }

    return false;
}

function drawPossibleMove(cell) { //, isHovered) {
//    if (isHovered == undefined) {
//        isHovered = false;
//    }

    var column  = cell.column,
        row     = cell.row,
        x       = (column * diskWidth) + (diskWidth / 2), // isHovered ? (column * diskWidth) + (diskWidth / 2) : (column * diskWidth) + (diskWidth / 2),
        y       = (row * diskHeight) + (diskHeight/ 2), // isHovered ? (row * diskHeight) + (diskHeight/ 2) : (row * diskHeight) + (diskHeight/ 2),
        radius  = (diskWidth / 10); // isHovered ? (diskWidth / 10) + 2 : (diskWidth / 10);
        
    if (currentPlayer == 1) {
        gCanvasContext.strokeStyle = player1StrokeStyle; // isHovered ? '#333' : player1StrokeStyle;
        gCanvasContext.fillStyle = player1FillStyle; // isHovered ? '#333' :  player1FillStyle;
    }
    else if (currentPlayer == 2) {
        gCanvasContext.strokeStyle = player2StrokeStyle; // isHovered ? '#666' :  player2StrokeStyle;
        gCanvasContext.fillStyle = player2FillStyle; // isHovered ? '#ddd' :  player2FillStyle;
    }
    else {
        return;
    }        

    gCanvasContext.beginPath();
    gCanvasContext.arc(x, y, radius, 0, Math.PI * 2, false);
    gCanvasContext.closePath();
    gCanvasContext.fill();
    gCanvasContext.stroke();
}

function drawPlayerDisk(cell) {
    var column  = cell.column,
        row     = cell.row,
        x       = (column * diskWidth) + (diskWidth / 2),
        y       = (row * diskHeight) + (diskHeight / 2),
        radius  = (diskWidth / 2)- (diskWidth / 10),
        player  = cell.state;

    if (player == 1) {
        gCanvasContext.fillStyle = player1FillStyle;
        gCanvasContext.strokeStyle = player1StrokeStyle;
    }
    else if (player == 2) {
        gCanvasContext.fillStyle = player2FillStyle;
        gCanvasContext.strokeStyle = player2StrokeStyle;
    }
    else {
        return;
    }

    gCanvasContext.beginPath();
    gCanvasContext.arc(x, y, radius, 0, Math.PI * 2, false);
    gCanvasContext.closePath();
    gCanvasContext.fill();
    gCanvasContext.stroke();
}

function drawCoordinates(cell) {  
    var column  = cell.column,
        row     = cell.row,
        x       = (column * diskWidth) + (diskWidth / 10),
        y       = (row * diskHeight) + (diskHeight / 5) + 5;

    // This draws the coordinates of a cell for debugging purposes
    gCanvasContext.fillStyle = '#888';

    gCanvasContext.font = 'bold 12px sans-serif';
    gCanvasContext.fillText('(' + row + ', ' + column + ')', x, y);

}

function drawBoard() {
    gCanvasContext.clearRect(0, 0, pixelWidth, pixelHeight);
    gCanvasContext.fillStyle = boardFillStyle;
    gCanvasContext.fillRect(0, 0, pixelWidth, pixelHeight);

    gCanvasContext.beginPath();

    // vertical lines
    for (var x = 0; x <= pixelWidth; x += diskWidth) {
        gCanvasContext.moveTo(0.5 + x, 0);
        gCanvasContext.lineTo(0.5 + x, pixelHeight);

        // horizontal lines
        for (var y = 0; y <= pixelHeight; y += diskHeight) {
            gCanvasContext.moveTo(0, 0.5 + y);
            gCanvasContext.lineTo(pixelWidth, 0.5 + y);                
        }
    }

    // draw the lines
    gCanvasContext.strokeStyle = boardStrokeStyle;
    gCanvasContext.stroke();

    for (var i = 0; i < numCells; ++i) {
        if (board[i].state != 0) {
            drawPlayerDisk(board[i]);
        }

//            drawCoordinates(board[i]);
    }        

    if (isRunning && isTheGameOver()) {
        endGame();
    }
    else {
        gStatusElement.innerHTML = '<p>Player ' + currentPlayer + "'s turn</p>";
        gStatusElement.innerHTML += '<p>Player 1: ' + getScore(1) + '; Player 2: ' + getScore(2) + '</p>';
    }
}

/**
 * Starts a new game.
 */
function newGame() {
    currentPlayer = 1;
    board = new Array();

    for (var y = 0; y < boardHeight; ++y) {
        for (var x = 0; x < boardWidth; ++x) {
            board.push(new Cell(y, x, 0));
        }
    }

    board[27].state = 2;
    board[28].state = 1;
    board[35].state = 1;
    board[36].state = 2;

    numCells = board.length;
    isRunning = true;

    drawBoard();
}

function getScore(player) {
    var score = 0;

    for (var i = 0; i < numCells; ++i) {
        if (board[i].state == player) ++score;
    }

    return score;
}

function endGame() {
    isRunning = false;
    gStatusElement.innerHTML = '<p>Game Over</p>' +
        '<p>Player 1 scored ' + getScore(1) + '</p>' +
        '<p>Player 2 scored ' + getScore(2) + '</p>';
}

/**
 * Initializes the game.
 * @param canvasElement The canvas element that will contain the game.
 * @param statusElement The element that will display the game status.
 */
function initGame(canvasElement, statusElement, newGameElement) {
    if (!canvasElement) {
        canvasElement = document.createElement('canvas');
        canvasElement.id = 'game_canvas';
        document.body.appendChild(canvasElement);
    }

    if (!statusElement) {
        statusElement = document.createElement('p');
        document.body.appendChild(statusElement);
    }

    if (!newGameElement) {
        newGameElement = document.createElement('button');
        newGameElement.id = 'new_game';
        document.body.appendChild(newGameElement);
    }

    gCanvasElement = canvasElement;
    gCanvasElement.width = pixelWidth;
    gCanvasElement.height = pixelHeight;
    gCanvasElement.addEventListener('click', gCanvasOnClick, false);
    gCanvasElement.addEventListener('mousemove', gCanvasOnMouseMove, false);
    gStatusElement = statusElement;
    gNewGameElement = newGameElement;
    gNewGameElement.addEventListener('click', newGame, false);
    gCanvasContext = gCanvasElement.getContext('2d');

    if (!resumeGame()) {
        newGame();
    }
}