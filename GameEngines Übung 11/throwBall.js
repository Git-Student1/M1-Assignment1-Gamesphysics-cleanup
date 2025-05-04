import CircleObject from "./circleObject";
export default class ThrowBall extends CircleObject{
    
    //stateMachine = new BallStateMachine(this)
    stuckToSeesaw = true
    _gravitation = 9.81 // m/s^2
    lastVelocityX = 0

    
    /**
     * creates an instance of throwball
     * @param {*} centerX - x value of the initial center of the ball
     * @param {*} centerY - y value of the initial center of the ball
     * @param {*} diameter - diameter of the ball
     * @param {*} rotationCenterX - x value of point that the ball rotates around (when it is on the seesaw)
     * @param {*} rotationCenterY - y value of point that the ball rotates around (when it is on the seesaw)
     */

    constructor(centerX, centerY, diameter,rotationCenterX, rotationCenterY, color, mass){
        super(centerX, centerY, diameter, color, mass)
        
        this.velocityX = 0
        this.velocityY = 0
        
        this.rotationCenterX = rotationCenterX
        this.rotationCenterY = rotationCenterY
    }
    

    /**
     * calulates the new position values of the ball depending on the new rotationValue, calulation is independent from the previous rotatationValue
     * @param {*} rotationValue - rotataionValue in radians
     */
    rotateAroundSeesawCenter(rotationValue){
        this.rotateAroundCenter(rotationValue, this.rotationCenterX, this.rotationCenterY)
      }

    /**
     * draws the throwBall
     * @param {*} M - number of pixels that display a m 
     */
    draw(M){
        fill(255,255,255)
        super.draw(M)
    }

    /**
     * calulates the new position values during the oblique throw
     * @param {*} dt - tie difference to the previous render
     */
    calulateNextPositionObliqueThrow(dt, windSpeed){
        
        let gravitationAccelerataion = this._gravitation*Math.pow(dt, 2)/2


        //TODO: recator and pull these data out
        ////////////////////////////////////////
            //sign cw
            let dragCoefficient = 0.45
            //mass of the boule
            let mBoule = 0.0045 //kg
            let airDensity = 1.3 //kg/m^3

            //TODO: move that to the ball as a computed property
            let ballCircleSurface = Math.PI * Math.pow(this.diameter/2,2)
        /////////////////////////////////////////

        //calulate the new velocity considering the gravitatation, air friction and wind 
                //wind is considered by the expression (this.velocityX + windSpeed)
                //air friction is considered by the expression: speedReductionCoefficientThroughAirFriction * velocity
        let currentVelocity = Math.sqrt( Math.pow(this.velocityX - windSpeed,2) + Math.pow(this.velocityY,2))
        //not a real physical constant, just a mean to reduce code dublication
        let speedReductionCoefficientThroughAirFriction = ((dragCoefficient * airDensity * ballCircleSurface)/(2 * mBoule)) * currentVelocity

        this.velocityY = this.velocityY -  (this._gravitation + speedReductionCoefficientThroughAirFriction * this.velocityY)*dt
        this.velocityX = this.velocityX - speedReductionCoefficientThroughAirFriction * (this.velocityX - windSpeed) * dt

        this.centerY = this.centerY + this.velocityY *dt //- gravitationAccelerataion
        this.centerX = this.centerX + this.velocityX *dt 
        
    }

    calulateNextPositionOnSlope(dt,segmentBallData){
        if(!(segmentBallData instanceof SegmentBallData)) throw new Error("segmentBallData is not of type SegmentBallData")
        if(!(segmentBallData._segment instanceof Segment)) throw new Error("segment in segmentBallData is not of type Segment")

        //this.velocityY = this.velocityY //-this._gravitation *Math.sin(slopeAngle)*dt
        //this.velocityX = this.velocityX //-this._gravitation *Math.cos(slopeAngle)*dt
        
        //apply gravitataion
        //rotate velocity  to fit the segment
        //set new velocityY 0 becuase the ball moves on the segment and connot fall through
        //calulate the next position 
        //rotate velocity back and save new velocity value
        //apply gravitataion
        
        this.#calulateNewPointOnSegmentAndVelocity(dt,segmentBallData)
        this.#calulatePositionFromSegmentPart(segmentBallData)
    }
    /**
     * updates the segmentBallData and updates the  velocity for the ball
     * @param {*} dt 
     * @param {SegmentBallData} segmentBallData 
     */
    #calulateNewPointOnSegmentAndVelocity(dt,segmentBallData){
        if(!(segmentBallData instanceof SegmentBallData)) throw new Error("segmentBallData is not of type SegmentBallData")
        if(!(segmentBallData._segment instanceof Segment)) throw new Error("segment in segmentBallData is not of type Segment")
        let coefficientOfFriction = 0.05
        this.velocityY = this.velocityY - this._gravitation * dt
        let velocity = new Vector(this.velocityX, this.velocityY)
        
        //rotate velocity  to fit the segment
        let angle = segmentBallData._segment.angle
        //on slope velocity
        let onSlopeVelocity = velocity.rotated(angle)
        onSlopeVelocity._y = 0
        //acceleration in the oposite direction of the velocity 
        let sign = this.sign(coefficientOfFriction,onSlopeVelocity._x, dt) 
        let acceleration  =  this._gravitation *(Math.sin(-angle) + sign * Math.cos(-angle) *coefficientOfFriction) * dt
        if(sign === 0) onSlopeVelocity._x = 0

        onSlopeVelocity._x = onSlopeVelocity._x + acceleration
        // console.log("acceleration: " + acceleration)
        // console.log("angle: "+ -angle)
        // console.log(this.sign(coefficientOfFriction,onSlopeVelocity._x, dt))
        segmentBallData._pointOnSegment += onSlopeVelocity._x * dt
 
        //converting back the on slope velocity to the "normal" velocity
        velocity = onSlopeVelocity.rotated(-angle)
        this.velocityY = velocity._y
        this.velocityX = velocity._x
        this.lastVelocityX = this.velocityX
    }
    sign(coefficientOfFriction, velocity, dt){
        if(velocity>0) return -1
        else if(Math.abs(velocity) < Math.abs(this._gravitation * coefficientOfFriction * dt)) return 0
        else return 1
    }

     /**
     * gets velocityOnTheSlope
     * @param {SegmentBallData} segmentBallData 
     */
    getOnSlopeVelocity(segmentBallData){
        if(!(segmentBallData instanceof SegmentBallData)) throw new Error("segmentBallData is not of type SegmentBallData")
        if(!(segmentBallData._segment instanceof Segment)) throw new Error("segment in segmentBallData is not of type Segment")

       
       // this.velocityY = this.velocityY - this._gravitation * dt
       // this.velocityX = this.velocityX + this.sign(coefficientOfFriction,this.velocityX) * this._gravitation * coefficientOfFriction * dt
        let velocity = new Vector(this.velocityX, this.velocityY)

        //rotate velocity  to fit the segment
        let normalisedSegmentVector = segmentBallData._segment.segmentVector.normalised()
        let angle = Math.atan2(normalisedSegmentVector._y, normalisedSegmentVector._x)

        //on slope velocity
        let onSlopeVelocity = velocity.rotated(angle)
        return onSlopeVelocity._x
    }

    /**
     * calulates the x and y value of the ball from the updated segmentBallData 
     * @param {*} segmentBallData 
     */
    #calulatePositionFromSegmentPart(segmentBallData){
        if(!(segmentBallData instanceof SegmentBallData)) throw new Error("segmentBallData is not of type SegmentBallData")
        if(!(segmentBallData._segment instanceof Segment)) throw new Error("segment in segmentBallData is not of type Segment")

        //get angle of segment to the ground
        let angle = segmentBallData._segment.angle
       // calulate the local vector on the slope to the ball in a rotated coordinate system where the slope is parallel to the ground
        let onSlopePointVectorUV = new Vector(segmentBallData._pointOnSegment, this.diameter/2)


        //console.log((new Vector(0, 0.02).rotated(-angle)))
        //rotate the local vector so that it has the correct oriantatio to the ground
        //let onSlopePointVectorXY = Vector.add( segmentBallData._segment.vectorToPointOnSegment(segmentBallData._pointOnSegment), ballOffset)
        
        let onSlopePointVectorXY = onSlopePointVectorUV.rotated(-angle)

        //calulate the origin vector for the position
        let originPointVector = Vector.add(segmentBallData._segment.p1Vector , onSlopePointVectorXY)
        
        // set the ball position
        this.centerX = originPointVector._x
        this.centerY = originPointVector._y

    }
    




    /**
     * sets the start velocity of the throwBall
     * @param {*} velocity - object with x, y value
     */
    setStartVelocity(velocity){
        this.setVelocity(velocity)
       // this.stateMachine.ballState = this.stateMachine.ballStates.ONFLIGHT
    }

    /**
     * sets the velocity of the throwBall
     * @param {*} velocity - object with x, y value
     */
    setVelocity(velocity){
        if(!(velocity.x!==undefined && this.velocityY!==undefined)) throw new Error("velocity misses x or/and y value")
        this.velocityX = velocity.x
        this.velocityY = velocity.y
    }
    
    /**
     * returns the current velocity of the throwball
     * @returns - object with x and y value -> {"x":value, "y":value}
     */
    getVelocity(){
        return {"x": this.velocityX, "y": this.velocityY}
    }
    /**
     * returns whether the ball is still rolling or compleately still (coasted down) 
     * @returns boolean
     */
    isCoastDown(){
        if(this.lastVelocityX === 0 && this.velocityX === 0)
            return true
        return false
    }


    
    
    
}

console.log("ThrowBall loaded")
window.ThrowBall = ThrowBall;