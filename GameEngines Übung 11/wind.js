class Wind {

    #maxValue = 5
    #minValue = -5
    #speed 


    constructor() {
        this.#speed = 0
    }


    /**
     * replaces the curren wind speed with a new random value in the range of the internal max and min value 
     */
    updateSpeed(){
        this.#speed = Math.random() * (this.#maxValue - this.#minValue) + this.#minValue
    }

    get speed() {
        return this.#speed
    }

    updateSize(windArrowBoxCenterX, windArrowBoxCenterY,windArrowBoxWidth,windArrowBoxHeight, arrowTextSize){
        this.windArrowBoxCenterX = windArrowBoxCenterX;
        this.windArrowBoxCenterY = windArrowBoxCenterY;
        this.windArrowBoxWidth = windArrowBoxWidth;
        this.windArrowBoxHeight = windArrowBoxHeight;
        this.arrowTextSize = arrowTextSize;
    }

    draw(){ 
        rectMode(CENTER)
        fill(254)
        rect(this.windArrowBoxCenterX,this.windArrowBoxCenterY, this.windArrowBoxWidth, this.windArrowBoxHeight)
        
        if(this.#speed !=0){
            let arrowDirection
            if(this.#speed >0)arrowDirection =1
            if(this.#speed <0)arrowDirection = -1
            let triangleStartX = this.windArrowBoxCenterX + arrowDirection * this.windArrowBoxWidth/2
            let triangleEndX = this.windArrowBoxCenterX + arrowDirection * this.windArrowBoxWidth/2 + arrowDirection * this.windArrowBoxHeight * 3
            let triangleUpperEdgeY = this.windArrowBoxCenterY + this.windArrowBoxHeight*1.5
            let triangleLowerEdgeY = this.windArrowBoxCenterY - this.windArrowBoxHeight*1.5
            triangle(triangleStartX, triangleUpperEdgeY, triangleStartX, triangleLowerEdgeY, triangleEndX, this.windArrowBoxCenterY)
        }
        text(Math.abs(this.#speed).toFixed(2) + " m/s", this.windArrowBoxCenterX,this.windArrowBoxCenterY +this.windArrowBoxHeight*3, this.arrowTextSize)

    }
}