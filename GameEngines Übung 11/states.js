export default class State{

        
        ONSEESAW = "onSeesaw"
        ONFLIGHT = "onFlight"
        ONSLOPE =  "onSlope"

        state = this.ONSEESAW
    
    constructor(){
    }

    changeStateTo(newState){
        if(!this.#stateInStates(newState)){
            throw new Error("state is invalid: "+newState )
        }
        this.ballState = newState
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