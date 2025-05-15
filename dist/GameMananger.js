"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Games_1 = require("./Games");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(u => u !== socket);
    }
    addHandler(socket) {
        socket.on("message", (d) => {
            const message = JSON.parse(d.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Games_1.Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find((g) => g.player1 === socket || g.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
