// roomId Id of the room in which the game is running on the server.
class Game {
    constructor(roomId) {
        this.roomId = roomId;
        this.board = [];
        this.moves = 0;
    }

    // Create the Game board by attaching event listeners to the buttons.
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

            // Update board after your turn.
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
    // Remove the menu from DOM, display the gameboard and greet the player.
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

    // Send an update to the opponent to update their UI's tile
    playTurn(tile) {
        const clickedTile = $(tile).attr('id');

        // Emit an event to update other player that you've played your turn.
        socket.emit('playTurn', {
            tile: clickedTile,
            room: this.getRoomId(),
        });
    }

    // End the game if the other player won.
    endGame(message) {
        alert(message);
        location.reload();
    }
}

export default class Game {}
