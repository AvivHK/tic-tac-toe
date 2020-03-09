class Game {
    constructor(roomId) {
        this.roomId = roomId;
        this.board = [];
        this.moves = 0;
    }

    createGameBoard() {
        function tileClickHandler() {
            const row = parseInt(this.id.split('_')[1][0], 10);
            const col = parseInt(this.id.split('_')[1][1], 10);
            if (!player.getCurrentTurn() || !game) {
                alert('Its not your turn!');
                return;
            }
            if ($(this).prop('disabled')) {
                alert('This tile has already been played on!');
                return;
            }

            game.playTurn(this);
            game.updateBoard(player.getPlayerType(), row, col, this.id);

            player.setCurrentTurn(false);
            player.updatePlaysArr(1 << ((row * 3) + col));
        }

        for (let i = 0; i < 3; i++) {
            this.board.push(['', '', '']);
            for (let j = 0; j < 3; j++) {
                $(`#button_${i}${j}`).on('click', tileClickHandler);
            }
        }
    }

    displayBoard(message) {
        $('.menu').css('display', 'none');
        $('.gameBoard').css('display', 'block');
        $('#userHello').html(message);
        this.createGameBoard();
    }

    updateBoard(type, row, col, tile) {
        $(`#${tile}`).text(type).prop('disabled', true);
        this.board[row][col] = type;
        this.moves++;
    }

    getRoomId() {
        return this.roomId;
    }

    playTurn(tile) {
        const clickedTile = $(tile).attr('id');

        socket.emit('playTurn', {
            tile: clickedTile,
            room: this.getRoomId(),
        });
    }

    endGame(message) {
        alert(message);
        location.reload();
    }
}