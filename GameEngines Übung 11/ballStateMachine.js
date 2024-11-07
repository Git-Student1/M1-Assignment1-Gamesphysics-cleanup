import ThrowBall from "throwball.js"
class BallStateMachine{

    ballStates = {
        ONSEESAW: "onSeesaw",
        ONFLIGHT: "onFlight",
        ONSLOPE: "onSlope"
    }
    
    constructor(throwball){
       
        if(!(throwball instanceof ThrowBall)) throw new Error("parameter is not instace of Throwball")
        //if(!(seesaw instanceof Seesaw)) throw new Error("parameter is not instace of seesaw")

        this.throwBall = throwball
       // this.seesaw = seesaw

        this.ballState = this.ballStates.ONSEESAW
    }

    #changeStateTo(newState){
        if(!this.#stateInStates(newState)){
            throw new Error("state is invalid: "+newState )
        }
        this.ballState = newState
    }

    /**
     * changes State to OnFlight and sets the start velocity of the ball, if there is an error the state will not change and the velocity of the ball will be reset
     * @param {*} startVelocity 
     */
    changeStateToOnFlight(startVelocity){
        let velocity = this.throwBall.getVelocity()
        try{
            this.throwBall.setVelocity(startVelocity)
            this.#changeStateTo(this.ballStates.ONFLIGHT)
        }
        catch(e){
            console.log(e)
            this.throwBall.setVelocity(velocity)   
        }
    }
    /**
     * changes state to onSeesaw
     */
    changeStateToOnSeesaw(){
        this.#changeStateTo(this.ballStates.ONSEESAW)
    }


    /**
     * returns whether the inserted parameter is one of the valid states
     * @param {*} newState 
     * @returns 
     */
    #stateInStates(newState){
        if(Object.values(this.ballStates).includes(newState)) return true
        return false

    }

    /**
     * returns wether the stae can change from the current to the new one
     * @param {*} newState 
     */
    #validStateChange(newState){
        throw new Error("is still not implemented")
    }
}