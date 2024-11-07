class Vector{
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x,y){
        if(typeof x !== "number" || typeof y !== "number") throw new Error("x or y are not of type number")
        this._x = x
        this._y = y
    }
    /**
     * returns vector from vector1 to vector2
     * @param {Vector} vector1 
     * @param {Vector} vector2 
     * @returns - vector
     */
    static sub(vector1, vector2){
        if(!(vector1 instanceof Vector) || !(vector2 instanceof Vector) ) throw new Error("both parameters have to be of type Vector")
        return new Vector(vector1._x-vector2._x, vector1._y-vector2._y)
    }

    static add(vector1, vector2){
        if(!(vector1 instanceof Vector) || !(vector2 instanceof Vector) ) throw new Error("both parameters have to be of type Vector")
        return new Vector(vector1._x+vector2._x, vector1._y+vector2._y)
    }
    
    static cross(vector1, vector2){
        if(!(vector1 instanceof Vector) || !(vector2 instanceof Vector) ) throw new Error("both parameters have to be of type Vector")
        return vector1._x * vector2._y  - vector1._y * vector2._x
    }
    static dot(vector1, vector2){
        if(!(vector1 instanceof Vector) || !(vector2 instanceof Vector) ) throw new Error("both parameters have to be of type Vector")
        return vector1._x * vector2._x + vector1._y * vector2._y
    }

    length(){
        return Math.sqrt(Math.pow(this._x,2) + Math.pow(this._y,2))
    }

    add_vector(vector){
        if(!(vector instanceof Vector)) throw new Error("parameter has to be of type Vector")
        this._x += vector._x
        this._y += vector._y
    }

    add_values(x,y){
        if(typeof x !== "number" || typeof y !== "number" ) throw new Error("parameters have to be of type Number")
        this._x += x
        this._y += y
    }

    /**
     * return new, normalized vector
     */
    normalised(){
        return new Vector(this._x/this.length(), this._y/this.length())
    }

    static mul(vector, value){
        if(!(vector instanceof Vector)) throw new Error("parameter has to be of type Vector")
        if(typeof value !== "number") throw new Error("prameter has to be of type number")
        return new Vector(vector._x * value, vector._y * value)
    }

    static div(vector, value){
        return Vector.mul(vector, 1/value)
    }

    static randians(vector1, vector2){
        if(!(vector1 instanceof Vector) || !(vector2 instanceof Vector) ) throw new Error("both parameters have to be of type Vector")
        return Math.acos( Vector.dot(vector1, vector2) / (vector1.length() * vector2.length()))
    }

    //returns rotated Vector
    rotated(angle){
        return new Vector(this._x  * Math.cos(angle) + this._y * Math.sin(angle), this._y * Math.cos(angle) - this._x * sin(angle))
    }
}