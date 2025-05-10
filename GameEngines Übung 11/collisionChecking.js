import Vector from "./vector.js"
import ThrowBall from "./throwBall.js"
import Segment from "./segment.js"
export default class SegmentBallData{
    /**
     * custom data about the collision
     * @param {Segment} segment - collisionSegment
     * @param {Number} pointOnSegment - distance from point1 to collisionPoint on segment
     */
    constructor(segment, pointOnSegment){
        this.setData(segment, pointOnSegment)
    }

    getCurrentSegmentBallData(){
        if(this._pointOnSegment<this._segment._limitLeft) {
            return new SegmentBallData(this._segment.getSegmentLeft(), this._segment.getSegmentLeft().getLimiterRight())
        }
        if(this._pointOnSegment>this._segment._limitRight){

         return new SegmentBallData(this._segment.getSegmentRight(), this._segment.getSegmentRight().getLimiterLeft())
        }
        return this
    }
    setData(segment, pointOnSegment){
        this._segment = segment
        this._pointOnSegment = pointOnSegment
    }

    copyFromData(segmentBallData){
        if(!(segmentBallData instanceof SegmentBallData)) throw new Error("segmentBallData is not instance of SegmentBallData")
        this.setData(segmentBallData._segment, segmentBallData._pointOnSegment)
    }

    overLeftLimit(){
        return this._pointOnSegment<this._segment._limitLeft
    }

    overRightLimit(){
        return this._pointOnSegment>this._segment._limitRight
    }
    dataForStartOnLeftSegment(){
        let segment = this._segment.getSegmentLeft()
        let pointOnSegment = this._segment.getSegmentLeft().getLimiterRight()
        this._segment = segment
        this._pointOnSegment = pointOnSegment
        return new SegmentBallData(segment, pointOnSegment)
    }
    dataForStartOnRightSegment(){
        let segment = this._segment.getSegmentRight()
        let pointOnSegment = this._segment.getSegmentRight().getLimiterLeft()
        this._segment = segment
        this._pointOnSegment = pointOnSegment
        return new SegmentBallData(segment,pointOnSegment )
    }


}


let currentSegmetnBallData = new SegmentBallData(null, null);

/**
 * checks for collisions of a ball with segments, there can be multiple collisions
 * @param {CircleObject} ball 
 * @param {[Segment]} segmentArray 
 */
export function checkCollisionWithSegments(ball,segmentArray, segmentBallData){
    if(!(ball instanceof ThrowBall)) throw new Error("ball is not instance of Throwball")
    if(!(segmentArray instanceof Array)) throw new Error("segmentArray is not instance of Array")
    if(!(segmentBallData instanceof SegmentBallData)) throw new Error("segmentBallData is not instance of SegmentBallData")

    for(let segment of segmentArray){
        let data = calulateCollisionPoint(ball, segment)
        segmentBallData.copyFromData(data)

        if(segmentBallData._segment) {
            return 
        }
    } 
}

export function checkCollisionBallLines(ball, pointArray){
    if(!(ball instanceof ThrowBall)) throw new Error("ball is not instance of Throwball")
    if(!(pointArray instanceof Array)) throw new Error("segmentArray is not instance of Array")
    
    for(let i = 0; i<pointArray.length-1; i++){
        let point1 = pointArray[i]
        let point2 = pointArray[i+1]
        let collision = checkCollisionBallLine(ball, point1, point2)

        if(collision) {
            
            ball.velocityX = 0
            ball.velocityY = 0
            return true
        }
    }
    return false
}


export function checkCollisionWithSegent(ball, segment){
    if(!(segment instanceof Segment)) throw new Error("segment is not instance of Segment")
    return checkCollisionBallLine(ball, segment._point1, segment._point2)
}

/**
 * 
 * @param {*} ball 
 * @param {*} linePoint1 
 * @param {*} linePoint2 
 * @returns 
 */
export function checkCollisionBallLine(ball, linePoint1, linePoint2){
    // vector from the point on the line to the cicle center (linePointToPointVector)
        // vector that represents the direction of the line (lineVector)
        // cross product of the vectors is the area of a paralellogram
        // the area of a paralellogram is height * base
        // the height is the needed distance
        // the base is the direction vector of the line
        // formular: lineVector x linePointToPointVector / length of lineVector
        if(!(ball instanceof ThrowBall)) throw new Error("ball is not instance of Throwball")

        if(typeof linePoint1.x!== "number" || typeof linePoint1.y !== "number") throw new Error("linePoint1 parameter has no x and/or y value")
        if(typeof linePoint2.x!== "number" || typeof linePoint2.y !== "number") throw new Error("linePoint2 parameter has no x and/or y value")



        //calulate line Vector
        let lineVector = {}
        lineVector.x = linePoint1.x - linePoint2.x
        lineVector.y = linePoint1.y - linePoint2.y

        //calulate linePointToPointVector
        let linePointToPointVector = {}
        linePointToPointVector.x = linePoint1.x -ball.centerX
        linePointToPointVector.y = linePoint1.y -ball.centerY
        
       
        //calulate the distance from the crossPoduct of the vectors and the length of the line Vector
        let crossProduct = lineVector.x * linePointToPointVector.y - lineVector.y * linePointToPointVector.x
        let lineVectorLength = Math.sqrt(Math.pow(lineVector.x, 2) + Math.pow(lineVector.y, 2) )
        let distance = Math.abs(crossProduct) / lineVectorLength
        //check for the intersection
        //min max x of collision line
        let maxX = Math.max(linePoint1.x, linePoint2.x)
        let minX = Math.min(linePoint1.x, linePoint2.x)
        //limit the collision to the length of the line, so that the line is not infinite 
        if(ball.centerX +ball.diameter/2 < minX || ball.centerX - ball.diameter/2>maxX ) return false

        //intersection if the distance is smaller than the diameter 
        if(distance<ball.diameter/2) return true
        return false
}


function calulateCollisionPoint(ball, segment){
    if(!(ball instanceof ThrowBall)) throw new Error("ball is not instance of Throwball")
    if(!(segment instanceof Segment)) throw new Error("segment is not instance of Segment")

    let ballVector = new Vector(ball.centerX, ball.centerY)
    let segmentEndPointToBallVector = Vector.sub(ballVector, segment.p1Vector)
    
    //unprecise by some reason
    let distance = Vector.cross(segmentEndPointToBallVector,segment.segmentVector ) / segment.segmentVector.length()
    

    //segmentPartPosition: distance on segment where the normal of the segment slices the ball center
    // if segmentPartPosition negative, there is no collsision
    let segmentPartPosition = Vector.dot(segmentEndPointToBallVector, segment.segmentVector ) / (segment.segmentVector.length())


    //origin to point where the normal through the ball slices the segment
    let segmentPartOriginVector = segment.vectorToPointOnSegment(segmentPartPosition)
    let distanceVector = Vector.sub(ballVector, segmentPartOriginVector)
    
        //Debug stuff:
        /*
        drawLine(segment.p1Vector, distanceVector)
       // drawLine(segment.p1Vector, segmentPartVector)
        //drawLineOrigin(segment.p1Vector)
        drawLine(segment.p1Vector, segmentEndPointToBallVector)

        drawLine(segment.p1Vector,segment.segmentVector)
        drawLine(segmentPartOriginVector,distanceVector)
        ellipse(kXi(segmentPartOriginVector._x*M), kYi(segmentPartOriginVector._y*M), 20, 20)
       console.log( i + ": "+ distance )
       */
    if(segmentPartPosition<0|| - distance - ball.diameter*0.500 > 0 ) return new SegmentBallData(null, null)

    let collisionDegree = Vector.randians(segment.segmentVector, new Vector(ball.velocityX, ball.velocityY))
    return new SegmentBallData(segment, segmentPartPosition)
    
}



export function collisionBalls(ball1, ball2, dt){
    if(!(ball1 instanceof ThrowBall)) throw new Error("ball1 is not instance of Throwball")
    if(!(ball2 instanceof ThrowBall)) throw new Error("ball2 is not instance of Throwball")
    let collisionTime = collisionTimeBalls2D(ball1, ball2)
    if(collisionTime<=dt && collisionTime>0) return true
    else return false
}
export function collisionBallsAir(ball1, ball2, dt){
    if(!(ball1 instanceof ThrowBall)) throw new Error("ball1 is not instance of Throwball")
    if(!(ball2 instanceof ThrowBall)) throw new Error("ball2 is not instance of Throwball")
    let collisionTime = collisionTimeBalls2D(ball1, ball2)
    if(collisionTime<=dt && collisionTime>0) return true
    else return false
}

export function collisionTimeBalls2D(ball1, ball2, logTimes){
    let collisionTimes = []
    let collisionTime1 = ( ball1.diameter/2 + ball2.diameter/2 + Math.sqrt(Math.pow(ball1.centerX - ball2.centerX,2) + Math.pow(ball2.centerY - ball1.centerY,2))) / Math.sqrt(Math.pow(ball2.velocityX - ball1.velocityX,2) + Math.pow(ball2.velocityY - ball1.velocityY,2))
    let collisionTime2 = ( ball1.diameter/2 + ball2.diameter/2 - Math.sqrt(Math.pow(ball1.centerX - ball2.centerX,2) + Math.pow(ball2.centerY - ball1.centerY,2))) / Math.sqrt(Math.pow(ball2.velocityX - ball1.velocityX,2) + Math.pow(ball2.velocityY - ball1.velocityY,2))
    let collisionTime3 = ( ball1.diameter/2 + ball2.diameter/2 + Math.sqrt(Math.pow(ball1.centerX - ball2.centerX,2) + Math.pow(ball2.centerY - ball1.centerY,2))) / - Math.sqrt(Math.pow(ball2.velocityX - ball1.velocityX,2) + Math.pow(ball2.velocityY - ball1.velocityY,2))
    let collisionTime4 = ( ball1.diameter/2 + ball2.diameter/2 - Math.sqrt(Math.pow(ball1.centerX - ball2.centerX,2) + Math.pow(ball2.centerY - ball1.centerY,2))) / - Math.sqrt(Math.pow(ball2.velocityX - ball1.velocityX,2) + Math.pow(ball2.velocityY - ball1.velocityY,2))

    let collisionTime5 = (-(ball1.diameter/2 + ball2.diameter/2) + Math.sqrt(Math.pow(ball1.centerX - ball2.centerX,2) + Math.pow(ball2.centerY - ball1.centerY,2))) / Math.sqrt(Math.pow(ball2.velocityX - ball1.velocityX,2) + Math.pow(ball2.velocityY - ball1.velocityY,2))
    let collisionTime6 = (-(ball1.diameter/2 + ball2.diameter/2) - Math.sqrt(Math.pow(ball1.centerX - ball2.centerX,2) + Math.pow(ball2.centerY - ball1.centerY,2))) / Math.sqrt(Math.pow(ball2.velocityX - ball1.velocityX,2) + Math.pow(ball2.velocityY - ball1.velocityY,2))
    let collisionTime7 = (-(ball1.diameter/2 + ball2.diameter/2) + Math.sqrt(Math.pow(ball1.centerX - ball2.centerX,2) + Math.pow(ball2.centerY - ball1.centerY,2))) / - Math.sqrt(Math.pow(ball2.velocityX - ball1.velocityX,2) + Math.pow(ball2.velocityY - ball1.velocityY,2))
    let collisionTime8 = (-(ball1.diameter/2 + ball2.diameter/2) - Math.sqrt(Math.pow(ball1.centerX - ball2.centerX,2) + Math.pow(ball2.centerY - ball1.centerY,2))) / - Math.sqrt(Math.pow(ball2.velocityX - ball1.velocityX,2) + Math.pow(ball2.velocityY - ball1.velocityY,2))
    collisionTimes.push(...[collisionTime1,/*collisionTime2,*/ collisionTime3,/*collisionTime4,*/ collisionTime5, collisionTime6, collisionTime7, collisionTime8])
    //collisionTimes.push(...[collisionTime1, collisionTime5])

    let smallesTime = Number.MAX_VALUE
    let index =0;
    let smallesIndex;
    collisionTimes.forEach(collisionTime => {
        index++
        if(collisionTime<smallesTime && collisionTime>0) {
            smallesTime=collisionTime
            smallesIndex = index
        }
    });
    return smallesTime
}

export function collisionTimeBalls1D(ball1, ball2, logTimes){
    let collisionTime1 = (ball1.diameter/2 + ball2.diameter/2 + ball1.centerX - ball2.centerX ) / (ball2.velocityX - ball1.velocityX)
    let collisionTime2 = (-ball1.diameter/2 - ball2.diameter/2 + ball1.centerX - ball2.centerX ) / (ball2.velocityX - ball1.velocityX)
    
    if(logTimes){
        console.log(collisionTime1)
        console.log(collisionTime2)
    }

    if(collisionTime1<collisionTime2 && collisionTime1>0) return collisionTime1
    else return collisionTime2

}

/**
 * applies the velocity exchange at the moment of the collision to the balls
 * @param {*} ball1 
 * @param {*} ball2 
 */
export function calculateCollisionBallsOnSegment(ball1, ball2){
    if(!(ball1 instanceof ThrowBall)) throw new Error("ball1 is not instance of Throwball")
    if(!(ball2 instanceof ThrowBall)) throw new Error("ball2 is not instance of Throwball")
    //elastic collision
    let newVelocityXBall1 = ((ball1.mass - ball2.mass)*ball1.velocityX + 2*ball2.mass*ball2.velocityX ) / (ball1.mass + ball2.mass)
    let newVelocityXBall2 = ((ball2.mass - ball1.mass)*ball2.velocityX + 2*ball1.mass*ball1.velocityX ) / (ball1.mass + ball2.mass)
    ball1.velocityX = newVelocityXBall1
    ball2.velocityX = newVelocityXBall2

}

export function calulateCollisionBallsInAir(ballOnSegment, ballInAir){
    if(!(ballOnSegment instanceof ThrowBall)) throw new Error("ballOnSegment is not instance of Throwball")
    if(!(ballInAir instanceof ThrowBall)) throw new Error("ballInAir is not instance of Throwball")
    //direction depends on the collision position
    
    //let newVelocityXBallOnSegment = Math.sqrt(Math.pow(ballInAir.velocityX,2) + Math.pow(ballInAir.velocityY,2))
    let newVelocityXBallOnSegment = ballInAir.velocityX
    // let ballInAirDirection = 0
    // if(ballInAir.velocityX > 0)ballInAirDirection = 1
    // else ballInAirDirection = - 1


    let collisionDirection = 0
    if(ballOnSegment.centerX >= ballInAir.centerX) collisionDirection = 1
    else collisionDirection = -1


    ballOnSegment.velocityX = newVelocityXBallOnSegment * collisionDirection //*ballInAirDirection
    
    ballInAir.velocityX = 0
    ballInAir.velocityY = 0
}

window.SegmentBallData = SegmentBallData;
window.collisionBallsAir = collisionBallsAir;
window.checkCollisionWithSegments = checkCollisionWithSegments;
window.checkCollisionBallLines = checkCollisionBallLines;
window.checkCollisionWithSegent = checkCollisionWithSegent;
window.collisionBalls = collisionBalls;
window.collisionTimeBalls2D = collisionTimeBalls2D;
window.calculateCollisionBallsOnSegment = calculateCollisionBallsOnSegment;