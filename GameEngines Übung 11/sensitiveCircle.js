import CircleObject from './CircleObject';

class SensitiveCircle extends CircleObject{
  

  /**
   * initializes a sensitiveCircle
   * @param {*} centerX - x coordinate of the circle center
   * @param {*} centerY - y coordinate of the circle center
   * @param {*} diameter - diameter of the circle
   */
    constructor(centerX,centerY, diameter, rotationCenterX, rotationCenterY){
      super(centerX,centerY, diameter)
        this.rotationCenterX = rotationCenterX
        this.rotationCenterY = rotationCenterY
    }
    /** 
     * returns wheather the mouse is in the circle
     * @param {*} M - number of pixels per meter
     * @returns -boolean: whether the mouse is in the sensitiveCircle
     */
     inCircle(M){
        let deltaX = mouseX - kXi(this.centerX*M);
        let deltaY = mouseY - kYi(this.centerY*M);
        let mouseDistanceToCycleCenter = Math.sqrt(Math.pow(deltaX,2)+Math.pow(deltaY,2))
        if(mouseDistanceToCycleCenter < (this.diameter/2)*M){
          //console.log("in cycle")
          return true
        } else return false
        
      }
      /**
       * updates x and y value of sentitiveCircle or thorws an exeption if the point does not have x and y value
       * @param {*} point - needs x and y value
       */
      updateValues(point){
        if(point.x && point.y){
          this.centerX = point.x
          this.centerY = point.y
        }
        else throw new Error("point has no x and/or y value")
      }
      /**
       * draws the sentitiveCircle
       * @param {*} M - number of pixels per meter
       */
      draw(M){
        fill(0,0,0)
        super.draw(M)
      }
      rotateAroundSeesawCenter(rotationValue){
        this.rotateAroundCenter(rotationValue, this.rotationCenterX, this.rotationCenterY)
      }


}

window.SensitiveCircle = SensitiveCircle;