class GameData {
    playerTurns = {
        PLAYER1: "Player1",
        PLAYER2: "Player2",
        GAMEEND: "GameEnd"
    }
    

    constructor(){
        this.playerTurn = this.playerTurns.PLAYER1
    }


    nextTurn(){
        if(this.playerTurn === this.playerTurns.PLAYER1){
            this.playerTurn = this.playerTurns.PLAYER2
        }
        else if(this.playerTurn === this.playerTurns.PLAYER2){
            this.playerTurn = this.playerTurns.GAMEEND
        }
        
    }


}