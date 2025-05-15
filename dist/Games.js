"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moveCount = 0;
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        if (this.moveCount % 2 == 0 && this.player2 === socket)
            return;
        if (this.moveCount % 2 == 1 && this.player1 === socket)
            return;
        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "Black" : "White"
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "Black" : "White"
                }
            }));
        }
        if (this.moveCount % 2 == 0) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        if (this.moveCount % 2 == 1) {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
