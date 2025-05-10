export default class Wind {


    constructor() {
        this.__speed = 0
        this.__maxValue = 5
        this.__minValue = -5
    }


    /**
     * replaces the curren wind speed with a new random value in the range of the internal max and min value 
     */
    updateSpeed(){
        this.__speed = Math.random() * (this.__maxValue - this.__minValue) + this.__minValue
    }

    get speed() {
        return this.__speed
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
        
        if(this.__speed !=0){
            let arrowDirection
            if(this.__speed >0)arrowDirection =1
            if(this.__speed <0)arrowDirection = -1
            let triangleStartX = this.windArrowBoxCenterX + arrowDirection * this.windArrowBoxWidth/2
            let triangleEndX = this.windArrowBoxCenterX + arrowDirection * this.windArrowBoxWidth/2 + arrowDirection * this.windArrowBoxHeight * 3
            let triangleUpperEdgeY = this.windArrowBoxCenterY + this.windArrowBoxHeight*1.5
            let triangleLowerEdgeY = this.windArrowBoxCenterY - this.windArrowBoxHeight*1.5
            triangle(triangleStartX, triangleUpperEdgeY, triangleStartX, triangleLowerEdgeY, triangleEndX, this.windArrowBoxCenterY)
        }
        text(Math.abs(this.__speed).toFixed(2) + " m/s", this.windArrowBoxCenterX,this.windArrowBoxCenterY +this.windArrowBoxHeight*3, this.arrowTextSize)

    }
}