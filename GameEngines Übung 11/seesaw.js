class Seesaw{
    static _plankHeight = 0.006
    static _plankWidth = 0.25
    static _ballStopWidth = 0.02
    static _ballStopHeight = 0.01


    _currentlyDragged = false
    _rotateUp = false
    _pullDegreeBelowStraight = 0.0
    _throw = false
    _seesawPlankMaxRotationForSec = 2500
    _velocity = 0

    /**
     * creates an instance of Seesaw that takes care of the support, plank and ballstopPart
     * @param {Number} seesawBaseX - x center of seesaw
     * @param {Number} seesawBaseY - y value of the bottom of the seesaw (bottom of the support)
     * @param {Number} maxRotation - max rotation of seesaw in degree in both directions
     * @param {Number} supportHeight - height of the support
     * @param {Number} ballStopX - x value of the ball stop
     */
    constructor(seesawBaseX, seesawBaseY, maxRotation, supportHeight, ballStopX){
        this._seesawBaseX = seesawBaseX
        this._seesawBaseY = seesawBaseY
        this._maxRotation = maxRotation
        this._supportHeight = supportHeight
        this._ballStopX = ballStopX

        // to macke it easy to exchange the source of these instance properties -> not from staic calss properties
        this._plankHeight = Seesaw._plankHeight
        this._plankWidth = Seesaw._plankWidth
        this._ballStopWidth = Seesaw._ballStopWidth
        this._ballStopHeight = Seesaw._ballStopHeight

        this._plankCenterY = this._seesawBaseY+this._supportHeight - this._plankHeight/2
        this._ballStopBottomY = this._plankCenterY + this._plankHeight/2

        this.#calulateSupportData()
    }
    get plankTopCenter(){
        let x = this._seesawBaseX
        let y = this._plankCenterY+this._plankHeight/2
        return {"x": x, "y": y}
    }


    #calulateSupportData() {
        this._supportEdgeLength = this._supportHeight/Math.sin(60/180*Math.PI)
        
    }
    /**
     * draws the seesaw support, plank and ballstop
     * @param {Number} M - number of pixels for a meter
     * @param {Number} rotationValue - rotation of the seesaw in degree
     */
    draw(M, rotationValue){
        fill(0,0,255)
        this.#drawSupport(M)
        this.#drawRotatables(M, rotationValue)
    }

    /**
     * if the seesaw was dragged and at that downwards, the rotateUp will become true and _pullDegreeBelowStraight will be set
     */
    activateSpringRotationIfDragged(){
        if(this._currentlyDragged){
        
            //save rotation after down pull

              this._rotateUp=true
            
          }
          this._currentlyDragged = false;
    }
    activateRotationIfDragged(){
        if(this._currentlyDragged){
        
            //save rotation after down pull
            if(this.rotation.rotateUpCondition()){
              this._pullDegreeBelowStraight= this.rotation.rotationValue
              this._rotateUp=true
            }
            else {this.rotation._pullDegreeBelowStraight = 0
            }
          }
          this._currentlyDragged = false;
    }


    checkForThrowStart(){
        if(this.rotation.rotationValue!=this.rotation.upperBorder){
            this._throw = false
        }
        return true
    }


    /**
     * rotate the seesaw upwards when rotateUp is true
     * @param {Number} dt 
     */
    rotateUpIfCondition(dt){

        if(this._rotateUp){
                
            this.rotation.rotationValue -=  this.calulateRotationDifferenceForDrag(this._pullDegreeBelowStraight, this._maxRotation, dt)

            
            //turn of rotation when seesaw rotation reaches its limit
            if(!this.rotation.inMaxRotationRange()){
            this._rotateUp=false;
            this._throw = true;
            
            }
            //limit the values to be in the roation range
            this.rotation.limitRotation()
        }
        
    }

    rotateUpWithSpringIfCondition(dt, ballMass){

        if(this._rotateUp){
                
            this.applySpringRotation(dt, ballMass)
            this.checkForThrowAndDeactivationOfRotation()
            
            
            //limit the values to be in the roation range
            this.rotation.limitRotation()
        }
        
    }
    


    applySpringRotation(dt, ballMass){
        let mass = ballMass
        let springConstant = 10 //  N/m
        let springFriction = 0
        let damping = (springFriction/mass)/2
        //German: selfOscillation -> Eigenschwinung
        let selfOscillationSq = springConstant / mass
        //TODO: gravitataion global
        let gravitation = 9.81 // m/s^2

        let rotationRadiusAtBallPosition  = this._plankWidth/2

        let sRestPosition = rotationRadiusAtBallPosition * radians(this.rotation.upperBorder)
        let sCurrently = rotationRadiusAtBallPosition * radians(this.rotation.rotationValue)
        let deltaS = sRestPosition - sCurrently


        
        //calulate acceleration and velocity
        let acceleration = gravitation - 2*damping*this._velocity - selfOscillationSq*(deltaS)
        this._velocity -= acceleration*dt


        //calculate the rotationDiv using the velocity and popar-coordinates
        //TODO: dont use the end of the seesaw but the ball position to be more accurate
        let rotationDegreeDiv = degrees((this._velocity / rotationRadiusAtBallPosition) * dt)
        this.rotation.rotationValue += rotationDegreeDiv


        
        

    }



    checkForThrowAndDeactivationOfRotation(){
        if(!(this.rotation.inMaxRotationRange())){
            this._rotateUp=false;
            this._throw = true;
            }
        this.rotation.limitRotation()
    }


    /**
 * calulates the rotation difference of a seesaw to the previous render
 * @param {*} seesawPullDegreeBelowStraight 
 * @param {*} maxRotation 
 * @param {*} dt 
 * @returns 
 */
  calulateRotationDifferenceForDrag(seesawPullDegreeBelowStraight, maxRotation, dt){
    //percentage of maximum negative rotation
    let rotationPercent = seesawPullDegreeBelowStraight/maxRotation
    //calulate the maximum degree that the seesaw cn rotate in db
    let maxRotationDivForDt = dt * this._seesawPlankMaxRotationForSec
    //calulate the rotationSpeed depending on the rotation of the seesaw after the drag  
    let rotationDiv = rotationPercent * maxRotationDivForDt
    return rotationDiv
  }
/**
 * returns rotataionSpeed in degree per second
 * @returns rotataionSpeed in degree
 */
  calulateRotataionSpeed(){
    //percentage of maximum negative rotation
    let rotationPercent = this._pullDegreeBelowStraight/this._maxRotation
    //calulate the rotataion speed in degree per second
    let rotatationSpeed = rotationPercent*this._seesawPlankMaxRotationForSec
    return rotatationSpeed
  }

  /**
   * 
   * @returns degree per second
   */
  calulateSpringRotationSpeed(){
    //TODO: update the radius to be the position of the ball if it is changed in applyStringRotation()
    let radius = this._plankWidth /2
    return degrees(this._velocity / radius)
  }

  calulateDistance(point1X, point1Y, point2X, point2Y){
    let deltaX = point1X - point2X
    let deltaY = point1Y - point2Y
    let distance =  Math.sqrt(Math.pow(deltaX,2)+Math.pow(deltaY,2))
    return distance
  }





 /**
  * 
  * @param {*} throwballX 
  * @param {*} throwballY 
  * @returns - x, y value of the velocity of an object on the seesaw
  */
 calculateThrowBallStartVelocityAfterRotation(throwballX, throwballY){
    let throwBallDistanceToRotationCenter = this.calulateDistance(this._seesawBaseX,this._plankCenterY, throwballX, throwballY)
    let degreePerSecond = this.calulateRotataionSpeed()
    

    let secondsPerRound = 360/degreePerSecond
    let velocity = 2 * Math.PI * throwBallDistanceToRotationCenter /secondsPerRound
    //calulate the movement direction of the things on the seesaw
    let ballMovementDirectionDegree =  this.rotation.get90DegreeAngleToCurrentOne()
    if(ballMovementDirectionDegree<-180) this.rotation.rotationValue +=360

    let velocityX = -velocity * Math.cos(radians(ballMovementDirectionDegree))
    let velocityY = velocity * Math.sin(radians(ballMovementDirectionDegree))
    return {x:velocityX, y:velocityY}
  }

  calculateThrowBallStartVelocityAfterSpringRotation(throwballX, throwballY){
    let velocity = Math.abs(this._velocity)

    //calulate the movement direction of the things on the seesaw
    let ballMovementDirectionDegree =  this.rotation.get90DegreeAngleToCurrentOne()
    if(ballMovementDirectionDegree<-180) this.rotation.rotationValue +=360
    console.log("ballMovementDirectionDegree")
    console.log(this.rotation.rotationValue)



    
    let velocityX = - velocity * Math.cos(radians(ballMovementDirectionDegree))
    let velocityY = velocity * Math.sin(radians(ballMovementDirectionDegree))

    return {x:velocityX, y:velocityY}
  }



    #drawSupport(M){
        this.#drawTriangle(this._seesawBaseX*M, this._seesawBaseY*M, this._supportEdgeLength*M, this._supportHeight*M)
    }
    #drawRotatables(M, rotationValue){
        push()
            rectMode(CENTER)
            translate(kXi(this._seesawBaseX*M), kYi(this._plankCenterY*M))
            rotate(radians(rotationValue))
            translate(-kXi(this._seesawBaseX*M),-kYi(this._plankCenterY*M))

            
            rect(kXi(this._seesawBaseX*M), kYi(this._plankCenterY*M), this._plankWidth*M,  this._plankHeight*M );
            this.#drawTriangle(this._ballStopX*M, this._ballStopBottomY*M, this._ballStopWidth*M, this._ballStopHeight*M);
        pop()
    }


    #drawTriangle(triangleCenterX, bottom, triangleBottomEdgeLength, triangleHeight){
        triangle(kXi(triangleCenterX- triangleBottomEdgeLength/2),kYi(bottom), kXi(triangleCenterX) , kYi(bottom +triangleHeight),   kXi(triangleCenterX+ triangleBottomEdgeLength/2),kYi(bottom))
      }

    

}

//TODO: left and right seesaw needs upper border property, the rest can be moved to superclass

class SeesawLeft extends Seesaw{
    /**
     * 
     * @param {Number} seesawBaseX - x center of seesaw
     * @param {Number} seesawBaseY - y value of the bottom of the seesaw (bottom of the support)
     * @param {Number} maxRotation - max rotation of seesaw in degree in both directions
     * @param {Number} supportHeight - height of the support
     * @param {Number} ballStopX - x value of the ball stop
     */
    constructor(seesawBaseX, seesawBaseY, maxRotation, supportHeight, ballStopX){
        super(seesawBaseX, seesawBaseY, maxRotation, supportHeight, ballStopX)
        this.rotation = new SeesawRotationLeft(seesawBaseX, this._plankCenterY, maxRotation)
    }
}


class SeesawRight extends Seesaw{
    /**
     * 
     * @param {Number} seesawBaseX - x center of seesaw
     * @param {Number} seesawBaseY - y value of the bottom of the seesaw (bottom of the support)
     * @param {Number} maxRotation - max rotation of seesaw in degree in both directions
     * @param {Number} supportHeight - height of the support
     * @param {Number} ballStopX - x value of the ball stop
     */
    constructor(seesawBaseX, seesawBaseY, maxRotation, supportHeight, ballStopX){
        super(seesawBaseX, seesawBaseY, maxRotation, supportHeight, ballStopX)
        this.rotation = new SeesawRotationRight(seesawBaseX, this._plankCenterY, maxRotation)
    }
}