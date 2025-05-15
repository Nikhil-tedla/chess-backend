import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Games";

export class GameManager{
    private pendingUser: WebSocket|null;
    private games:Game[];
    private users: WebSocket[];
    constructor(){
        this.games=[];
        this.pendingUser=null;
        this.users=[];
    }
    addUser(socket:WebSocket){
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket:WebSocket){
        this.users=this.users.filter(u=>u!==socket)
    }
    private addHandler(socket:WebSocket){
        socket.on("message",(d)=>{
            const message=JSON.parse(d.toString());
            if(message.type===INIT_GAME){
                if(this.pendingUser){
                    const game=new Game(this.pendingUser,socket);
                    this.games.push(game);
                    this.pendingUser=null;

                }
                else{
                    this.pendingUser=socket;
                }

                
            }
            if(message.type===MOVE){
                const game=this.games.find((g)=>g.player1===socket||g.player2===socket);
                if(game){
                    game.makeMove(socket,message.move);
                }
            }
        })
    }

}