var kBoardWidth     = 9,
    kBoardHeight    = 9;
    kPieceWidth     = 50;
    kPieceHeight    = 50;
    kPixelWidth     = 1 + (kBoardWidth * kPieceWidth),
    kPixelHeight    = 1 + (kBoardHeight * kPieceHeight);

var gCanvasElement,
    gDrawingContext,
    gNumPieces,
    gPattern,
    gPieces,
    gSelectedPieceIndex,
    gSelectedPieceHasMoved,
    gMoveCount,
    gMoveCountElem,
    gGameInProgress;

function Cell(row, column) {
    this.row    = row;
    this.column = column;
}

/**
 * Returns the Cell object with .row and .cell properties
 */
var getCursorPosition = function(e) {
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
    x = Math.min(x, kBoardWidth * kPieceWidth);
    y = Math.min(y, kBoardHeight * kPieceHeight);

    return new Cell(Math.floor(y/kPieceHeight), Math.floor(x/kPieceWidth));
};

var halmaOnClick = function(e) {
    var cell = getCursorPosition(e);

    for (var i = 0; i < gNumPieces; ++i) {
        if ((gPieces[i].row == cell.row) && (gPieces[i].column == cell.column)) {
            clickOnPiece(i);
            return;
        }
    }

    clickOnEmptyCell(cell);
};

var clickOnEmptyCell = function(cell) {
    if (gSelectedPieceIndex == -1) return;

    var rowDiff     = Math.abs(cell.row - gPieces[gSelectedPieceIndex].row),
        columnDiff  = Math.abs(cell.column - gPieces[gSelectedPieceIndex].column);

    if ((rowDiff <= 1) && (columnDiff <= 1)) {
        // we know this click was on an empty square, so this must mean this was a valid single-square move
        gPieces[gSelectedPieceIndex].row = cell.row;
        gPieces[gSelectedPieceIndex].column = cell.column;
        ++gMoveCount;
        gSelectedPieceIndex = -1;
        gSelectedPieceHasMoved = false;
        drawBoard();
        return;
    }

    if ((((rowDiff == 2) && (columnDiff == 0)) ||
         ((rowDiff == 0) && (columnDiff == 2)) ||
         ((rowDiff == 2) && (columnDiff == 2))) &&
         isThereAPieceBetween(gPieces[gSelectedPieceIndex], cell)) {
        // this was a valid jump
        if (!gSelectedPieceHasMoved) {
            ++gMoveCount;
        }

        gSelectedPieceHasMoved = true;
        gPieces[gSelectedPieceIndex].row = cell.row;
        gPieces[gSelectedPieceIndex].column = cell.column;
        drawBoard();
        return;
    }
};

var clickOnPiece = function(pieceIndex) {
    if (gSelectedPieceIndex == pieceIndex) return;

    gSelectedPieceIndex = pieceIndex;
    gSelectedPieceHasMoved = false;
    drawBoard();
};

var isThereAPieceBetween = function(cell1, cell2) {
    // note: assumes cell1 and cell2 are 2 squares away either vertically, horizontally, or diagonally.
    var rowBetween = (cell1.row + cell2.row) / 2,
        columnBetween = (cell1.column + cell2.column) / 2;

    for (var i = 0; i < gNumPieces; ++i) {
        if ((gPieces[i].row == rowBetween) && (gPieces[i].column == columnBetween)) {
            return true;
        }
    }

    return false;
};

var isTheGameOver = function() {
    // if any piece is outside of the right corner, the game is still going
    for (var i = 0; i < gNumPieces; ++i) {
        if (gPieces[i].row > 2) {
            return false;
        }
        if (gPieces[i].column < (kBoardWidth - 3)) {
            return false;
        }
    }

    return true;
};

var drawBoard = function() {
    if (gGameInProgress && isTheGameOver()) {
        endGame();
    }

    gDrawingContext.clearRect(0, 0, kPixelWidth, kPixelHeight);

    gDrawingContext.beginPath();

    // vertical lines
    for (var x = 0; x <= kPixelWidth; x += kPieceWidth) {
        gDrawingContext.moveTo(0.5 + x, 0);
        gDrawingContext.lineTo(0.5 + x, kPixelHeight);
    }

    // horizontal lines
    for (var y = 0; y <= kPixelHeight; y += kPieceHeight) {
        gDrawingContext.moveTo(0, 0.5 + y);
        gDrawingContext.lineTo(kPixelWidth, 0.5 + y);
    }

    // draw the lines
    gDrawingContext.strokeStyle = '#cccccc';
    gDrawingContext.stroke();

    for (var i = 0; i < gNumPieces; ++i) {
        drawPiece(gPieces[i], i == gSelectedPieceIndex);
    }

    gMoveCountElem.innerHTML = 'Moves: ' + gMoveCount;
    saveGameState();
};

var drawPiece = function(p, selected) {
    var column = p.column,
        row = p.row,
        x = (column * kPieceWidth) + (kPieceWidth / 2),
        y = (row * kPieceHeight) + (kPieceHeight / 2),
        radius = (kPieceWidth / 2) - (kPieceWidth/10);

    gDrawingContext.beginPath();
    gDrawingContext.arc(x, y, radius, 0, Math.PI * 2, false);
    gDrawingContext.closePath();
    gDrawingContext.strokeStyle = "#000000";
    gDrawingContext.stroke();

    if (selected) {
        gDrawingContext.fillStyle = "#000000";
        gDrawingContext.fill();
    }
};

if (typeof resumeGame != 'function') {
    saveGameState = function() {
        return false;
    };

    resumeGame = function() {
        return false;
    }
}

var newGame = function() {
    gPieces = [ 
        new Cell(kBoardHeight - 3, 0),
        new Cell(kBoardHeight - 2, 0),
        new Cell(kBoardHeight - 1, 0),
        new Cell(kBoardHeight - 3, 1),
        new Cell(kBoardHeight - 2, 1),
        new Cell(kBoardHeight - 1, 1),
        new Cell(kBoardHeight - 3, 2),
        new Cell(kBoardHeight - 2, 2),
        new Cell(kBoardHeight - 1, 2)];

    gNumPieces = gPieces.length;
    gSelectedPieceIndex = -1;
    gSelectedPieceHasMoved = false;
    gMoveCount = 0;
    gGameInProgress = true;

    drawBoard();
};

var endGame = function() {
    gSelectedPieceIndex = -1;
    gGameInProgress = false;
    gMoveCountElem.innerHTML = 'Game complete in ' + moveCount + ' moves!';
};

var initGame = function(canvasElement, moveCountElement) {
    if (!canvasElement) {
        canvasElement = document.createElement('canvas');
        canvasElement.id = 'halma_canvas';
        document.body.appendChild(canvasElement);
    }

    if (!moveCountElement) {
        moveCountElement = document.createElement('p');
        document.body.appendChild(moveCountElement);
    }

    gCanvasElement = canvasElement;
    gCanvasElement.width = kPixelWidth;
    gCanvasElement.height = kPixelHeight;
    gCanvasElement.addEventListener('click', halmaOnClick, false);
    gMoveCountElem = moveCountElement;
    gDrawingContext = gCanvasElement.getContext('2d');

    if (!resumeGame()) {
        newGame();
    }
};