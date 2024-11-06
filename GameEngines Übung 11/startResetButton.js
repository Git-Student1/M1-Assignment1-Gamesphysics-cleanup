 class StartResetButton{
    buttonTextStart = "Start"
    buttonTextReset = "Reset"

    constructor(){
        this.buttonText = this.buttonTextStart;
    }
    inButton(mouseX, mouseY){
        //console.log(""+mouseX+ " "+ mouseY)
       let leftBorder = this.startbuttonCenterX -this.startbuttonWidth/2;
       let rightBorder = this.startbuttonCenterX + this.startbuttonWidth/2;
       let topBorder = this.startbuttonCenterY - this.startbuttonHeight/2;
       let bottomBorder = this.startbuttonCenterY + this.startbuttonHeight/2;

       
       if(mouseX>leftBorder && mouseX<rightBorder){
         if(mouseY>topBorder && mouseY<bottomBorder){
           return true
         }
       }
       return false
      }
    changeText(){
        this.buttonText === this.buttonTextStart ? this.buttonText=this.buttonTextReset: this.buttonText= this.buttonTextStart;
    }
    draw(){

        //button
        rectMode(CENTER)
        fill(200)
        rect(this.startbuttonCenterX,this.startbuttonCenterY, this.startbuttonWidth, this.startbuttonHeight)
        
        //button text
        fill(0)

        textSize(this.buttonTextSize)
        //draw button texts
        textAlign(CENTER, CENTER);
        text(this.buttonText,this.startbuttonCenterX,this.startbuttonCenterY, this.startbuttonWidth, this.startbuttonHeight)
    }
    updateSize(startbuttonCenterX, startbuttonCenterY,startbuttonWidth,startbuttonHeight, buttonTextSize){
        this.startbuttonCenterX = startbuttonCenterX;
        this.startbuttonCenterY = startbuttonCenterY;
        this.startbuttonWidth = startbuttonWidth;
        this.startbuttonHeight = startbuttonHeight;
        this.buttonTextSize = buttonTextSize;
    }
    
}