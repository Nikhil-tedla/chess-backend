import WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
export class Game{
    public player1:WebSocket;
    public player2:WebSocket;
    private board:Chess;
    private moveCount:number;
    
    private startTime:Date;
    constructor(player1:WebSocket,player2:WebSocket){
        this.player1=player1;
        this.player2=player2;
        this.board=new Chess();
        this.moveCount=0;
        
        this.startTime=new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"white"
            }

        }))
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"black"
            }

        }))

    }
    makeMove(socket:WebSocket,move:{
        from:string,
        to:string
    }){
        if(this.moveCount%2==0 && this.player2===socket)return;
        if(this.moveCount%2==1 && this.player1===socket)return;
        try{
            this.board.move(move);
            
        }
        catch(e){
            console.log(e);
            return ;
        }
        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:this.board.turn()==="w"?"Black":"White"
                }

            }))
            this.player2.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:this.board.turn()==="w"?"Black":"White"
                }

            }))
        }
        if(this.moveCount%2==0){
            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:move

            }))
        }
        if(this.moveCount%2==1){
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:move

            }))
        }
        this.moveCount++;

    }

}