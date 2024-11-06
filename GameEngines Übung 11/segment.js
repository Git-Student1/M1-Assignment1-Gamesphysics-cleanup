class Segment{
    constructor(point1, point2){
        if(!point1 || !point2) throw new Error("point1 or point2 are not defined")
        if(typeof point1.x !== "number" || typeof point1.y !== "number") throw new Error("point1 has no x and/or y value of type number")
        if(typeof point2.x !== "number" || typeof point2.y !== "number") throw new Error("point1 has no x and/or y value of type number")
        this._point1 = point1
        this._point2 = point2 
        console.log(Vector.add( this.p1Vector, this.segmentVector))
    }
    /**
     * sets the left  limiter for the segment
     * @param {Number} limitLeft 
     */
    setLimiterLeft(limitLeft){
        if(limitLeft > 0)
        this._limitLeft = limitLeft

    }
    /**
     * sets the right limiter for the segment
     * @param {Number} limitRight 
     */
    setLimiterRight(limitRight){
        if( limitRight < this.length) 
        this._limitRight = limitRight
        console.log("length: "+this.length)
    }

    /**
     * returns the distance of the limiter along the segmentvector from startpoint of the segment
     * @returns left limiter as a number
     */
    getLimiterLeft(){
        if(!this._limitLeft)throw new Error("limiter is not set")
        return this._limitLeft
    }

    /**
     * returns the distance of the limiter along the segmentvector from startpoint of the segment
     * @returns right limiter as a number 
     */
    getLimiterRight(){
        if(!this._limitRight)throw new Error("limiter is not set")
        return this._limitRight
    }


    /**
     * sets the left segment 
     * @param {Segment} segmentLeft 
     */
    setSegmentLeft(segmentLeft){
        if(!(segmentLeft instanceof Segment)) throw new Error("segment is not instance of Segment")
        this.segmentLeft = segmentLeft
    }
    /**
     * sets the right segment
     * @param {Segment} segmentRight 
     */
    setSegmentRight(segmentRight){
        if(!(segmentRight instanceof Segment)) throw new Error("segment is not instance of Segment")
        this.segmentRight = segmentRight
    }
    /**
     *  
     * @returns the left segment
     */
    getSegmentLeft(){
        if(!this.segmentLeft)throw new Error("segment is not set")
        return this.segmentLeft
    }
    /**
     * 
     * @returns the right segment
     */
    getSegmentRight(){
        if(!this.segmentRight)throw new Error("segment is not set")
        return this.segmentRight
    }
    drawLimiter(M){
        if(this._limitLeft){
            let limiterVectorLeft = Vector.add(this.p1Vector, Vector.mul(this.segmentVector.normalised() , this._limitLeft))
            ellipse(kXi(limiterVectorLeft._x*M),kYi(limiterVectorLeft._y*M), 2, 2)
        }
        
        if(this._limitRight){
            let limiterVectorRight = Vector.add(this.p1Vector, Vector.mul(this.segmentVector.normalised() , this._limitRight))
            ellipse(kXi(limiterVectorRight._x*M),kYi(limiterVectorRight._y*M), 2, 2)
        }
    }

    /**
     * returs a new p5 segment-vector from point1 to point2, (copy for the case that p1Vector will be a discrete value in the future-> to avoid future errors)
     */
    get segmentVector(){
        return Vector.sub(this.p2Vector, this.p1Vector)
    }

    /**
     * return a new, calulated p5 vector to point1 
     */
    get p1Vector(){
        return new Vector(this._point1.x, this._point1.y)
    }

    /**
     * return a new, calulated p5 vector to point2 
     */
    get p2Vector(){
        return new Vector(this._point2.x, this._point2.y)
    }

    /**
     * return the length of the segment
     */
    get length(){
        console.log("p1:"+this._point1)
        return Math.sqrt(Math.pow(this._point1.x- this._point2.x,2) + Math.pow(this._point1.y- this._point2.y,2))
    }

    vectorToPointOnSegment(segmentPartPosition){
        let segmentPartVector = Vector.mul(this.segmentVector.normalised(), segmentPartPosition)
        let segmentPartOriginVector = Vector.add(this.p1Vector,segmentPartVector)
        return segmentPartOriginVector
    }

    get angle(){
        let normSegmentVector = this.segmentVector.normalised()
        let angle = Math.atan2(normSegmentVector._y, normSegmentVector._x)
        return angle
    }

}