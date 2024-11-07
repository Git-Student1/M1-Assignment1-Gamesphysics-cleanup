
class CollisionCircle{
    
    constructor(circle){
        if(!(cicle instanceof CircleObject)){
            throw new Error("CollisionCircle can only be instanciated with a circle object")
        }
        this._centerX = centerX
        this._centerY = centerY
        this._diameter = diameter
    }

    /**
     * retruns true if the circle collision box intersects with another one, inserted as a parameter
     * @param {CollisionCircle} circleCollisionBox 
     * @returns 
     */
    checkIntersectionCircle(circleCollisionBox){
        //make sure that the inserted parameter is of type CollisionBoxCircle
        if(!(circleCollisionBox instanceof CollisionCircle)) throw new Error("collisionBox not of type CollisionBoxCircle as required")
        let deltaX = this._centerX - circleCollisionBox._centerX
        let deltaY = this._centerY - circleCollisionBox._centerY
        let distance = Math.sqrt(Math.pow(deltaX,2)+Math.pow(deltaY, 2))
        if(distance < this._diameter +circleCollisionBox._diameter) return true
        return false
    }

    checkIntersectionLine(collisionLineCenter, rotationDegree, lineLength){
        // vector from the point on the line to the cicle center (linePointToPointVector)
        // vector that represents the direction of the line (lineVector)
        // cross product of the vectors is the area of a paralellogram
        // the area of a paralellogram is height * base
        // the height is the needed distance
        // the base is the direction vector of the line
        // formular: lineVector x linePointToPointVector / length of lineVector



        if(!collisionLineCenter.x || !collisionLineCenter.y) throw new Error("point parameter has no x and/or y value")
        //create second point from rotataionValue
        let point2OnLine = {};
        point2OnLine.x = collisionLineCenter.x + Math.cos(radians(rotationDegree))
        point2OnLine.y = collisionLineCenter.y + Math.sin(radians(rotationDegree))

        //calulate line Vector
        let lineVector = {}
        lineVector.x = collisionLineCenter.x - point2OnLine.x
        lineVector.y = collisionLineCenter.y - point2OnLine.y

        //calulate linePointToPointVector
        let linePointToPointVector = {}
        linePointToPointVector.x = collisionLineCenter.x -this._centerX
        linePointToPointVector.y = collisionLineCenter.y -this._centerY
       
        //calulate the distance from the crossPoduct of the vectors and the length of the line Vector
        let crossProduct = lineVector.x * linePointToPointVector.y - lineVector.y * linePointToPointVector.x
        let lineVectorLength = Math.sqrt(Math.pow(lineVector.x, 2) + Math.pow(lineVector.y, 2) )
        let distance = Math.abs(crossProduct) / lineVectorLength

        //check for the intersection
        //min max x of collision line
        let maxX = collisionLineCenter.x + Math.cos(radians(rotationDegree))*lineLength/2
        let minX = collisionLineCenter.x - Math.cos(radians(rotationDegree))*lineLength/2
        //limit the collision to the length of the line, so that the line is not infinite 
        if(centerX - this._diameter < minX || centerX + this._diameter>maxX) return false
        //intersection if the distance is smaller than the diameter 
        return distance<this._diameter
    }
}