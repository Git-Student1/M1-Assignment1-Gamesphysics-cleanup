class SeesawRotation{
    //in degree
    _rotationValue = 0;

    /**
     * creates an instance that saves a roation value, offers some information and the possibility to change it using the mouse position
     * @param {*} rotationCenterX - x value of angle point  
     * @param {*} rotationCenterY - y value of angle point
     * @param {*} maxRotationValue - maximum rotaion in both directions in degree
     * @param {*} rotationOffset - offset from the rotation in degree, the right seesaw crrently needs 180
     */
    constructor(rotationCenterX,rotationCenterY, maxRotationValue,rotationOffset){
        this.rotationOffset = rotationOffset
        this.rotationCenterX = rotationCenterX
        this.rotationCenterY = rotationCenterY
    } 

    /**
     * limits the rotation between upper and lower border defined by maxRotationValue
     */
    limitRotation(){
        if(this.outsideRotationBorderLower()) this._rotationValue = this.lowerBorder
        if(this.outsideRotationBorderUpper()) this._rotationValue = this.upperBorder
    }

    /** 
     * checks in the roatiaonValue is in below the lower Border
     * @returns - boolean
     */
    outsideRotationBorderLower(){
        throw new Error("need the implement this method")
    }

    /**
     * checks in the roatiaonValue is in above the upper Border
     * @returns - boolean
     */
    outsideRotationBorderUpper(){
        throw new Error("need the implement this method")   
    }

    inMaxRotationRange(){
        if(this.outsideRotationBorderLower())return false;
        else if(this.outsideRotationBorderUpper())return false;
        return true
    }


    /**
     * function that recalulated the roataionvalue of the seesaw depending on the mouse position and return that value
     * @param {*} M - number of pixels per meter
     * @param {*} mouseX - x position of mouse
     * @param {*} mouseY - y position of mouse
     * @returns 
     */
     calulateRotationValueOfSeesaw(M, mouseX, mouseY){
        let deltaMouseAndRotationCenterX = this.rotationCenterX*M -iXk(mouseX)
        let deltaMouseAndRotationCenterY = this.rotationCenterY*M - iYk(mouseY)
        // console.log("X: " + deltaMouseAndRotationCenterX)
        // console.log("Y: " + deltaMouseAndRotationCenterY)

        let rotationValueUncorrected =degrees(Math.atan2(deltaMouseAndRotationCenterY, deltaMouseAndRotationCenterX))
        let rotationValueCorrected =this.correctRotationValueForMouseDrag( rotationValueUncorrected   )
        
        this._rotationValue = rotationValueCorrected
        this.limitRotation()
        return this._rotationValue
    }

    /**
     * returns a corrected rotationValue for the seesaw
     * @param {Number} rotationValueUncorrected - rotationValue that has to be corrected
     * @returns - corrected rotationValue
     */
    correctRotationValueForMouseDrag(rotationValueUncorrected){
        throw new Error("need to implement this method")
    }
    get90DegreeAngleToCurrentOne(){
        throw new Error("need to implement this method")
    }

    /**
     * returns roationValue in degree
     */
    get rotationValue(){
        return this._rotationValue
    }
    set rotationValue(a){
        this._rotationValue = a
    }
    

}


class SeesawRotationLeft extends SeesawRotation{
    constructor(rotationCenterX,rotationCenterY, maxRotationValue){
    super(rotationCenterX,rotationCenterY, maxRotationValue, 0)
    this.upperBorder = maxRotationValue 
    this.lowerBorder = -maxRotationValue
    this._rotationValue = this.upperBorder
    }

    
    outsideRotationBorderLower(){
        //for the right border check you have to substract 180 in degree
        if(this._rotationValue<this.lowerBorder && this._rotationValue>-180+this.rotationOffset)return true;
        return false
    }

   
    outsideRotationBorderUpper(){
        //for the right border check you have to substract 180 in degree
        if(this._rotationValue>this.upperBorder &&this._rotationValue<180+this.rotationOffset) return true
        return false    
    }
    /**
     * returns whether the rotateUp condition is true
     * @returns - true if the condition is fullfilled
     */
    rotateUpCondition(){
        return seesawLeft.rotation.rotationValue<0 
    }

    /**
     * returns a corrected rotationValue for the seesaw
     * @param {Number} rotationValueUncorrected - rotationValue that has to be corrected
     * @returns - corrected rotationValue
     */
    correctRotationValueForMouseDrag(rotationValueUncorrected){
        return - rotationValueUncorrected
    }
    
    get90DegreeAngleToCurrentOne(){
        return this._rotationValue + 90
    }
        
    
}

class SeesawRotationRight extends SeesawRotation{
    constructor(rotationCenterX,rotationCenterY, maxRotationValue){
        super(rotationCenterX,rotationCenterY, maxRotationValue,180)
        this.upperBorder = -maxRotationValue 
        this.lowerBorder = maxRotationValue
        this._rotationValue = this.upperBorder
        }
    
    outsideRotationBorderLower(){
        if(this._rotationValue>this.lowerBorder && this._rotationValue<180) return true;
        return false;
      }
    outsideRotationBorderUpper(){
        if(this._rotationValue<this.upperBorder &&this._rotationValue>-180) return true;
        return false;
      }

      /**
     * returns whether the rotateUp condition is true
     * @returns - true if the condition is fullfilled
     */
      rotateUpCondition(){
       return seesawRight.rotation.rotationValue>0
      }
     
    /**
     * returns a corrected rotationValue for the seesaw
     * @param {Number} rotationValueUncorrected - rotationValue that has to be corrected
     * @returns - corrected rotationValue
     */
    correctRotationValueForMouseDrag(rotationValueUncorrected){
        if(rotationValueUncorrected<0)return -180 - rotationValueUncorrected
        if(rotationValueUncorrected>0)return 180 - rotationValueUncorrected
    }
    
    get90DegreeAngleToCurrentOne(){
        return this._rotationValue + 90 
    }
}