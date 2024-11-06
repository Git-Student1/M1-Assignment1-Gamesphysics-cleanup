
let m = 1000; //ein meter sind x (hier 1000) pixel
let backgroundColor = 100;
let leftOffset = 0.1 *m;//meters offset left

function setup() {
  let bottom= 0.8 *m;
  createCanvas(1.5*m, 1*m);
  background(backgroundColor);
  fill(0,255,0)
  rect(0, 0.8*m, 2*m, 0.2*m);
  
  
  //seesaw (=wippe)
  //seesawSupport is a triangle
  fill(0,0,255)
  let seeSawSupport1CenterX = (0.125)*m +leftOffset; 
  let seeSawSupport2CenterX = seeSawSupport1CenterX + 1*m;
  
  //höhe:8,38 bei 7.5 seitenlänge des dreiecks
  let seeSawSupportEdgeLength = 0.05 *m;
  let seeSawSupportHeight = calulateIsoscelesTriangleHeight(seeSawSupportEdgeLength)
  drawTriangle(seeSawSupport1CenterX, bottom, seeSawSupportEdgeLength,seeSawSupportHeight)
  drawTriangle(seeSawSupport2CenterX, bottom, seeSawSupportEdgeLength,seeSawSupportHeight)
  
  //seesaw
  let seesaw1StartX = leftOffset ;
  let seesaw2StartX = leftOffset +1*m
  
  let seesawHeight = 0.006*m;
  let seesawWidth = 0.25*m;
  let seesawStartY = bottom - seeSawSupportHeight - seesawHeight;
  rect(seesaw1StartX,seesawStartY,seesawWidth,  seesawHeight );
  rect(seesaw2StartX,seesawStartY,seesawWidth,  seesawHeight );

  //seesawBallStop
  let ballDiameter =0.02 *m
  let seesawBallStopWidth = 0.02*m;
  let seesawBallStopBottom = seesawStartY; //upper edge of the seesaw board
  let seesawBallStop1CenterX = seesaw1StartX+ballDiameter +seesawBallStopWidth/2;
  let seesawBallStop2CenterX = seesaw2StartX+ seesawWidth-ballDiameter -seesawBallStopWidth/2;
  let seesawBallStopHeight = 0.01*m;
  drawTriangle(seesawBallStop1CenterX, seesawBallStopBottom, seesawBallStopWidth, seesawBallStopHeight);
  drawTriangle(seesawBallStop2CenterX, seesawBallStopBottom, seesawBallStopWidth, seesawBallStopHeight);

  //red bounds
  fill(255,0,0)
  let redBoundWidth = 0.05*m ;
  let redBound1StartX = seeSawSupport1CenterX + 0.2 *m -redBoundWidth;
  let redBound2StartX = seeSawSupport2CenterX - 0.2 *m -redBoundWidth;
  let redBoundHeight = 0.02*m;
  let redBoundStartY = bottom;
  rect(redBound1StartX,redBoundStartY,redBoundWidth, redBoundHeight  )
  rect(redBound2StartX,redBoundStartY,redBoundWidth, redBoundHeight  )

  //throwBalls of player 1 and 2 that are thrown into the playground
  fill(240,240,240)
  let throwBallLeftX = seesaw1StartX +0.01 *m;
  let throwBallRightX = seesaw2StartX +seesawWidth -0.01 *m;
  let throwBallDiameter = 0.02 *m;
  let throwBallY = seesawStartY - throwBallDiameter/2;
  ellipse(throwBallLeftX,throwBallY, throwBallDiameter,throwBallDiameter );
  ellipse(throwBallRightX,throwBallY, throwBallDiameter,throwBallDiameter );
  
  fill(255,140,0)
  //Cochonnet (is the ball in th middle)
  let cochonnetDiameter = 0.02*m;
  let cochonnetX = seeSawSupport1CenterX +0.5 *m - cochonnetDiameter/2;
  let cochonnetY = bottom - cochonnetDiameter/2;
  ellipse(cochonnetX, cochonnetY, cochonnetDiameter, cochonnetDiameter)
  

}
// isosceles tiangle = gleischenkliges Dreieck
/*
function drawIsoscelesTriangle(triangleCenterX, bottom, triangleEdgeLength){
  let triangleHeight = calulateIsoscelesTriangleHeight(triangleEdgeLength)
  triangle((triangleCenterX- triangleEdgeLength/2),bottom, triangleCenterX , bottom -triangleHeight,   (triangleCenterX+ triangleEdgeLength/2),bottom)
}
*/

function drawTriangle(triangleCenterX, bottom, triangleEdgeLength, triangleHeight){
  triangle((triangleCenterX- triangleEdgeLength/2),bottom, triangleCenterX , bottom -triangleHeight,   (triangleCenterX+ triangleEdgeLength/2),bottom)
}

function calulateIsoscelesTriangleHeight(triangleEdgeLength){
  let triangleHeight =Math.sqrt( Math.pow(triangleEdgeLength,2) - Math.pow(triangleEdgeLength/2, 2));
  return triangleHeight
}




function draw() {

}