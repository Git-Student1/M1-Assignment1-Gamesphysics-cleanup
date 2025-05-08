/**
 * Es handelt sich bei diesem Projekt um ein Spiel was 
 * wöchendlich durch neue Funktionaliät ergänzt wird.
 * 
 * Dabei liegt der Schwerpunkt auf den Physics die in dem Spiel vorkommen
 * 
 * Bei meiner Umsetzung des Projektes habe ich anfangs allen Code in dieses Dokument gesteckt
 * Mit der Zeit wurde das dann allerdings recht voll, 
 *  welhalb ich Teile des Codes in andere Dokumente ausgelagert habe
 * Dabei habe ich mich entschieden, bei den Teilen, an denen ich gerefactort habe,
 *  einen objektorientierten Ansatz einzubringen -> 
 *  z.B. eine  "throwball","seesaw", etc Instanz ist für sich selbst verantwortlich
 *  (ich hoffe, dass ich hier das Wort orientiert angebracht ist 
 *  und ich keine Grundprinzipien des objektorientierten Programmierens vernachlässigt habe)
 * Wie leicht zu erkennen ist, ist das Projekt als Ganzes derzeit noch nicht wirklich objektorientiert
 * Mit jeder neuen Aufgabe versuche ich dennoch weiterhin so vorzufahren wie bisher: Klassen deinieren und deren Instanzen nutzen
 *  um die Übersichtlichkeit in dem Projekt zu wahren
 * 
 * Mein Ziel für die Zukunft ist weitere Teile des Codes 
 *  von diesem Dokument zu trennen und wenn möglich mehr für objektorientierten Code zu sorgen
 * 
 * Autor: Maximilian Ehlert
 * Datum: 21.11.2022
 * 
 */



/**
 * ungenauigkeit bei der berechnung der ball position
 * mögliche ursachen: 
 *  segment vector ist ungenau, 
 *  oder angle in throball on slope berechnung ist ungenau
 */
import {Seesaw} from "./seesaw.js"
import SeesawLeft from "./seesaw.js"
import {SeesawRight} from "./seesaw.js"
import ThrowBall from "./throwBall.js"
import SegmentBallData from "./collisionChecking.js"
import SensitiveCircle from "./sensitiveCircle.js"
import State from "./states.js"
import StartResetButton from "./startResetButton.js"
import Segment from "./segment.js"
import Vector from "./vector.js"
import Wind from "./wind.js"
import GameData from "./gameData.js"
import {collisionBallsAir, checkCollisionWithSegments, collisionBalls, collisionTimeBalls2D, calculateCollisionBallsOnSegment} from "./collisionChecking.js"


console.log("test")

/*declaration*/
let M; //ein meter sind x (hier 1000) pixel 
let backgroundColor = 100;

let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

let xi0; let yi0;
let playgroundWidth = 1.6;
let playgroundHeight = 0.6;
let bottom= 0.0;

let groundHeight = 0.1*playgroundHeight;

let seesawBaseX = 0.5

//in degree In Each Direction
let maxRotation=20

let seesawPlankHeight = 0.006;
let seesawPlankWidth = 0.25;


let ballDiameter =0.04 
let seesawBallStopWidth = 0.02;
let seesawBallStopHeight = 0.01;

let redBoundWidth = 0.05;
let redBoundHeight = 0.02;

let throwBallDiameter = 0.04 ;

let cochonnetDiameter = 0.04;
let cochonnetX = 0.0;

let throwballMass = 0.0045;
let cochonnetMass = 0.0025;

let throwballColor = 'rgb(255,255,255)'
let cochonnetColor = 'rgb(255,140,0)'


//seesawBase
let seesawBaseLeftX = -0.5;
let seesawBaseRightX = 0.5;




let t, dt;
let frmRate = 60;
let timeScale = 0.5


//seesawSupport
let seeSawSupportHeight = Math.sin(maxRotation/180*Math.PI)*0.125
let seeSawSupportEdgeLength = seeSawSupportHeight/Math.sin(60/180*Math.PI)

//seesawPlank

let seesawPlankCenterY = bottom + seeSawSupportHeight - seesawPlankHeight/2;

//seesawBallStop

let seesawBallStopX = seesawBaseX + Seesaw._plankWidth/2 - ballDiameter -Seesaw._ballStopWidth/2;

let seesawLeft = new SeesawLeft(-seesawBaseX,bottom, maxRotation, seeSawSupportHeight, -seesawBallStopX)
let seesawRight = new SeesawRight(seesawBaseX,bottom, maxRotation, seeSawSupportHeight, seesawBallStopX)
console.log(seesawLeft)

//red bounds
let redBoundCenterX = seesawBaseRightX - 0.2  -redBoundWidth/2
let redBound1CenterX = seesawBaseLeftX + 0.2  + redBoundWidth/2;
let redBound2CenterX = seesawBaseRightX - 0.2  -redBoundWidth/2;

let redBoundStartY = bottom-redBoundHeight/2;

//throwing ball

let throwBallLeftX = seesawLeft._ballStopX - seesawLeft._ballStopWidth - throwBallDiameter/4;
let throwBallRightX = seesawRight._ballStopX + seesawRight._ballStopWidth + throwBallDiameter/4;
let throwBallDistanceToRotationCenter = throwBallRightX - seesawBaseRightX;
let throwBallYStart = seesawLeft._plankCenterY + seesawLeft._plankHeight/2 + throwBallDiameter/2;
let throwBallLeftY = throwBallYStart;
let throwBallRightY =throwBallYStart;


let throwballLeft = new ThrowBall(throwBallLeftX, throwBallYStart, throwBallDiameter, seesawLeft._seesawBaseX, seesawLeft._plankCenterY, throwballColor, throwballMass)
let throwballRight = new ThrowBall(throwBallRightX, throwBallYStart, throwBallDiameter, seesawRight._seesawBaseX, seesawRight._plankCenterY, throwballColor, throwballMass)




//throwballLeft.stateMachine.changeStateToOnFlight({"x":1,"y":2})
//console.log(throwballLeft.stateMachine.ballState)

//cochonnet

let cochonnetY = bottom + cochonnetDiameter/2;
let cochonnet  = new ThrowBall(0, cochonnetY, cochonnetDiameter, 0, 0, cochonnetColor, cochonnetMass )

//sensible Circle
let sensibleCircleDiameter = seesawPlankWidth/5;

let sensitiveCircleYStart = seesawPlankCenterY;
let sensitiveCircleLeftXStart = seesawBaseLeftX-seesawPlankWidth/2;
let sensitiveCircleRightXStart = seesawBaseRightX+seesawPlankWidth/2;

let sensitiveCircleLeft = new SensitiveCircle(sensitiveCircleLeftXStart,sensitiveCircleYStart,throwBallDiameter,seesawBaseLeftX, seesawPlankCenterY )
let sensitiveCircleRight = new SensitiveCircle(sensitiveCircleRightXStart,sensitiveCircleYStart,throwBallDiameter,seesawBaseRightX, seesawPlankCenterY )



let mPressed = false;
let mClicked = false;
let mReleased = false;





let states = {
  ONSEESAW: "onSeesaw",
  ONFLIGHT: "onFlight",
  ONSLOPE: "onSlope"
}
let stateLeft = new State()
let stateRight = new State()




let startResetButton = new StartResetButton();

let segmentPointArray =[]
let segmentArray;

let segmentBallDataLeft;
let segmentBallDataRight;
let segmentBallDataCochonnet;

let wind = new Wind()
let gameData = new GameData()

let collisionAirLeft = false
let collisionAirRight = false

let resultText


//kartesische  x Koordinate zu interne x Koordinate
export function kXi(kx){
  return (kx+xi0);
}
//kartesische  y Koordinate zu interne y Koordinate (von der Moodle Dokumentation)
export function kYi(ky){
  return (yi0-ky);
}

// interne x Koordinate zu kartesische x Koordinate
export function iXk(ix){
  return(ix-xi0)
}
// interne y Koordinate zu kartesische y Koordinate
export function iYk(iy){
  return(yi0-iy)
}


function setup() {
  createCanvas(canvasWidth,canvasHeight);
  frameRate()
  dt = 1/frmRate * timeScale;

let seesawLeftPoints = calulateEndPointsOfLine(seesawLeft.plankTopCenter, -maxRotation,seesawLeft._plankWidth)
let seesawRightPoints = calulateEndPointsOfLine(seesawRight.plankTopCenter, maxRotation,seesawRight._plankWidth)
segmentPointArray.push(seesawLeftPoints.point1)
segmentPointArray.push(seesawLeftPoints.point2)
segmentPointArray.push(seesawRightPoints.point1)
segmentPointArray.push(seesawRightPoints.point2)

segmentArray = createSegmentArray(segmentPointArray)
// the "segmentArray = " is unnessasary
segmentArray = addSegmentProperties(segmentArray, throwBallDiameter)
segmentBallDataLeft = new SegmentBallData()
segmentBallDataRight = new SegmentBallData()
if(!(segmentArray[1] instanceof Segment)) throw new Error()
segmentBallDataCochonnet = new SegmentBallData(segmentArray[1], segmentArray[1].length/2)

wind.updateSpeed()
console.log("rotation:")
console.log(seesawLeft.rotation)
//updateValues of the sensitive circle
sensitiveCircleLeft.rotateAroundSeesawCenter(radians(seesawLeft.rotation._rotationValue))
//update values of throw ball
throwballLeft.rotateAroundSeesawCenter(radians(seesawLeft.rotation._rotationValue))

//updateValues of the sensitive circle
sensitiveCircleRight.rotateAroundSeesawCenter(radians(seesawRight.rotation._rotationValue))
//update values of throw ball
throwballRight.rotateAroundSeesawCenter(radians(seesawRight.rotation._rotationValue))

let resultText = ""
}


function calulateEndPointsOfLine(centerPoint, rotatationDegree, length){
  if(!centerPoint.x || !centerPoint.y) throw new Error("point parameter has no x and/or y value")
  let deltaX = Math.cos(radians(rotatationDegree)) * length
  let deltaY = Math.sin(radians(rotatationDegree)) * length
  let point1 = {};
  point1.x = centerPoint.x - deltaX/2
  point1.y = centerPoint.y - deltaY/2

  let point2 = {};
  point2.x = centerPoint.x + deltaX/2
  point2.y = centerPoint.y + deltaY/2
  return {"point1":point1, "point2":point2}
}

function createSegmentArray(segmentPointArray){
  let segmentArray = []
  for(let i =0; i<segmentPointArray.length-1; i++){
    //console.log(segmentPointArray[i+1])
    segmentArray.push(new Segment(segmentPointArray[i], segmentPointArray[i+1]))
  }
  return segmentArray
}

function addLimiter(previousSegment,currentSegment , throwBallDiameter) {
    if(!(previousSegment instanceof Segment)) throw new Error("segmentArray at index "+ i +" is not an instance of Segment")
    if(!(currentSegment instanceof Segment)) throw new Error("segmentArray at index "+ i +" is not an instance of Segment")
    
     let degree = Vector.randians(previousSegment.segmentVector, currentSegment.segmentVector)
     let limiter = (throwBallDiameter/2) * Math.tan(degree/2)
     previousSegment.setLimiterRight(previousSegment.length - limiter)
     currentSegment.setLimiterLeft(limiter)
}



function setAdjacentSegment(previousSegment, currentSegment){
    if(!(previousSegment instanceof Segment)) throw new Error("previousSegment is not an instance of Segment")
    if(!(currentSegment instanceof Segment)) throw new Error("currentSegment is not an instance of Segment")
     previousSegment.setSegmentRight(currentSegment)
     currentSegment.setSegmentLeft(previousSegment)
    } 


function addSegmentProperties(segmentArray, throwBallDiameter){
  if(!(segmentArray instanceof Array)) throw new Error("segmentArray is not an instance of Array")
  for(let i =0; i<segmentArray.length; i++){
    if(i>0) {
    let previousSegment = segmentArray[i-1]
    let currentSegment = segmentArray[i]
    if(!(previousSegment instanceof Segment)) throw new Error("segmentArray at index "+ i +" is not an instance of Segment")
    if(!(currentSegment instanceof Segment)) throw new Error("segmentArray at index "+ i +" is not an instance of Segment")
    addLimiter(previousSegment,currentSegment, throwBallDiameter)
    setAdjacentSegment(previousSegment,currentSegment)
    }
  }
  return segmentArray

}




function drawTriangle(triangleCenterX, bottom, triangleBottomEdgeLength, triangleHeight){
  triangle(kXi(triangleCenterX- triangleBottomEdgeLength/2),kYi(bottom), kXi(triangleCenterX) , kYi(bottom +triangleHeight),   kXi(triangleCenterX+ triangleBottomEdgeLength/2),kYi(bottom))
}

function calulateIsoscelesTriangleHeight(triangleEdgeLength){
  let triangleHeight =Math.sqrt( Math.pow(triangleEdgeLength,2) - Math.pow(triangleEdgeLength/2, 2));
  return triangleHeight
}





function draw() {
M=0.9*canvasWidth/playgroundWidth;
xi0 = 0.5*canvasWidth
yi0 = 0.8*canvasHeight;
//time
t = t + dt;






/* administration*/
  background(backgroundColor);
  
  //-> grid over the canvas ->  1 gridX/Y is 1 percentage of the canvas
  let gridX = canvasWidth/100;
  let gridY = canvasHeight/100;    
  
  let sizeOfButtonText =   min(canvasWidth, canvasHeight)/20;
  let sizeOfWindText =   min(canvasWidth, canvasHeight)/100;
  let sizeOfInfoText =  min(canvasWidth, canvasHeight)/40;
  let sizeOfResultText = min(canvasWidth, canvasHeight)/20;

  drawInfoText(gridX, gridY, sizeOfInfoText)
  updateDrawStartResetButton(gridX, gridY,sizeOfButtonText)
  updateWindArrow(gridX, gridY, sizeOfWindText)
  drawResult(gridX, gridY, sizeOfResultText)
  

  if(gameData.playerTurn === gameData.playerTurns.PLAYER1)
  gameProcess(seesawLeft, throwballLeft, sensitiveCircleLeft, stateLeft, segmentBallDataLeft, wind, throwballRight,stateRight, segmentBallDataRight, cochonnet, segmentBallDataCochonnet)
  else if(gameData.playerTurn === gameData.playerTurns.PLAYER2)
  gameProcess(seesawRight, throwballRight, sensitiveCircleRight, stateRight, segmentBallDataRight, wind, throwballLeft,stateLeft, segmentBallDataLeft, cochonnet, segmentBallDataCochonnet)
  else if(gameData.playerTurn === gameData.playerTurns.GAMEEND)
  showResult(cochonnet)
  


/* display */

push()

rectMode(CENTER)

    fill(150,150,150)
    rectMode(CENTER)
    
    rect(kXi(0*M), kYi((playgroundHeight/2)*M), playgroundWidth*M, playgroundHeight*M)
    fill(0,255,0)
    rect(kXi(0),kYi(-0.5*groundHeight*M), playgroundWidth*M, groundHeight*M);
    
    
    /*
    ellipse(kXi(segmentPointArray[0].x*M), kYi(segmentPointArray[0].y*M), 20, 20)
    ellipse(kXi(segmentPointArray[1].x*M), kYi(segmentPointArray[1].y*M), 20, 20)
    ellipse(kXi(segmentPointArray[2].x*M), kYi(segmentPointArray[2].y*M), 20, 20)
    ellipse(kXi(segmentPointArray[3].x*M), kYi(segmentPointArray[3].y*M), 20, 20)
  	*/
    segmentArray[0].drawLimiter(M, kXi, kYi)
    segmentArray[1].drawLimiter(M, kXi, kYi)
    segmentArray[2].drawLimiter(M, kXi, kYi)
    //red bounds
    fill(255,0,0)
    rect(kXi(redBound1CenterX*M),kYi(redBoundStartY*M), redBoundWidth*M, redBoundHeight*M  )
    rect(kXi(redBound2CenterX*M),kYi(redBoundStartY*M), redBoundWidth*M, redBoundHeight*M  )
  
    
  pop()

mClicked=false;
mReleased=false;

seesawLeft.draw(M, seesawLeft.rotation.rotationValue)
seesawRight.draw(M, seesawRight.rotation.rotationValue)

throwballLeft.draw(M)
throwballRight.draw(M)
cochonnet.draw(M)

sensitiveCircleLeft.draw(M)
sensitiveCircleRight.draw(M)
wind.draw()
}

function drawInfoText(gridX, gridY, sizeOfText){
  textSize(sizeOfText)
  textAlign(LEFT, TOP);
  fill(0 )
  text("Maximilian Ehlert", 0*gridX, 0*gridY,  )
  text("s0578292", 0*gridX, 5*gridY,  )
  text("20.02.2022", 0*gridX, 10*gridY )
  textSize()

}
function updateDrawStartResetButton(gridX, gridY, sizeOfText){
    //startResetButton
    let startbuttonCenterX = 80 * gridX;
    let startbuttonCenterY = 90 * gridY;
    let startbuttonWidth = 12*gridX
    let startbuttonHeight = 10*gridY

    startResetButton.updateSize(startbuttonCenterX,startbuttonCenterY, startbuttonWidth,startbuttonHeight, sizeOfText);
   
    //change text when clicked
    if(mClicked){
      if(startResetButton.inButton(mouseX,mouseY)){
        startResetButton.changeText()    
      }

    }
    //draw Button
    startResetButton.draw()
}

function updateWindArrow(gridX, gridY, sizeOfText){
  //startResetButton
  let windArrowBoxCenterX = 80 * gridX;
  let windArrowBoxCenterY = 10 * gridY;
  let windArrowBoxWidth = 8*gridX
  let windArrowBoxHeight = 3*gridY

  wind.updateSize(windArrowBoxCenterX,windArrowBoxCenterY, windArrowBoxWidth,windArrowBoxHeight, sizeOfText);
 
  
}

function drawResult(gridX, gridY, sizeOfText){
  textSize(sizeOfText)
  textAlign(CENTER, CENTER);
  text(resultText, 50*gridX, 10*gridY )
}

function showResult(cochonnet){
  if(!(cochonnet instanceof ThrowBall)) throw new Error("cochonnet parameter  is not of type ThrowBall")
  if(cochonnet.centerX >0){
    resultText = "player 2 (right side) won"
  }
  if(cochonnet.centerX <0){
    resultText = "player 1 (left side) won"
  }
  if(cochonnet.centerX ===0){
    resultText = "draw"
  }
}




/**
 * does all the calculation, state ckecking and mouse interaction ckecking for 1 side of the game including the seesw, thwoball, senitiveCircle
 * @param {Seesaw} seesaw - some seesaw Instance
 * @param {ThrowBall} throwball - throwball on that seesaw
 * @param {SensitiveCircle} sensitiveCircle - sensitiveCircle for that  seesaw
 * @param {State} state - state for that gameSide
 * @param {SegmentBallData} segmentBallData - data about the segment the ball is on and the exact location on that segment
 */
function gameProcess(seesaw, throwball, sensitiveCircle, state, segmentBallData, wind, otherThrowBall, otherThrowBallState, otherSegmentBallData, cochonnet, cochonnetSegmentBallData){
  if(!(seesaw instanceof Seesaw)) throw new Error("seesaw parameter  is not of type Seesaw")
  if(!(throwball instanceof ThrowBall)) throw new Error("throwball parameter  is not of type ThrowBall")
  if(!(sensitiveCircle instanceof SensitiveCircle)) throw new Error("sensitiveCircle parameter  is not of type SensitiveCircle")
  if(!(state instanceof State)) throw new Error("state parameter is not of type State")
  if(!(wind instanceof Wind)) throw new Error("wind parameter is not of type Wind")
  if(!(otherThrowBall instanceof ThrowBall)) throw new Error("otherThrowBall parameter  is not of type ThrowBall")
  if(!(otherThrowBallState instanceof State)) throw new Error("otherThrowBallState parameter is not of type State")
  if(!(cochonnet instanceof ThrowBall)) throw new Error("cochonnet parameter  is not of type ThrowBall")
  if(!(segmentBallData instanceof SegmentBallData)) throw new Error("segmentBallData parameter  is not of type SegmentBallData")
  if(!(otherSegmentBallData instanceof SegmentBallData)) throw new Error("otherSegmentBallData parameter  is not of type SegmentBallData")



  switch(state.state){
    case state.ONSEESAW:
      {
          //mouse seesaw controll
        {
          if(mPressed){
            //make it possible to drag seesaw when in sensitive circle
            if(sensitiveCircle.inCircle(M)){
              seesaw._currentlyDragged = true
            }
          }
          //rotate with mouse
          if(seesaw._currentlyDragged){
            seesaw.rotation.calulateRotationValueOfSeesaw(M,mouseX, mouseY)
          }

          //TODO: remove this and implement 2 phase draw
          if(mReleased && seesaw._rotateUp){
            wind.updateSpeed()
          }

          //stop dragging seesaw and calulate rotationspeed
          if(mReleased){
            seesaw.activateSpringRotationIfDragged()
          }
          
        }

      /*calulation*/
      seesaw.rotateUpWithSpringIfCondition(dt, throwball.mass)

      //state changes
      if(seesaw._throw){
        let velocity = seesaw.calculateThrowBallStartVelocityAfterSpringRotation(throwball.centerX, throwball.centerY)
        throwball.setStartVelocity(velocity)
        seesaw._throw = false
        state.state = state.ONFLIGHT
      }

      //updateValues of the sensitive circle
      sensitiveCircle.rotateAroundSeesawCenter(radians(seesaw.rotation.rotationValue))
      //update values of throw ball
      throwball.rotateAroundSeesawCenter(radians(seesaw.rotation.rotationValue))
      break
      }

      //-------------------- ONFLIGHT ----------------------------
      case state.ONFLIGHT:{

        
        //handle collision with other ball
        let collisionAllowed = gameData.playerTurn === gameData.playerTurns.PLAYER1 ? !collisionAirLeft : !collisionAirRight
        if(collisionBallsAir(throwball, cochonnet, dt) && collisionAllowed) {
          console.log("collision Air")
          let timeUntilColllision = collisionTimeBalls2D(throwball, cochonnet)
          throwball.calulateNextPositionObliqueThrow(timeUntilColllision, wind.speed )
          cochonnet.calulateNextPositionOnSlope(timeUntilColllision, segmentBallDataCochonnet)
          calulateCollisionBallsInAir(cochonnet, throwball)
          throwball.calulateNextPositionObliqueThrow(dt - timeUntilColllision, wind.speed )
          cochonnet.calulateNextPositionOnSlope(dt - timeUntilColllision, segmentBallDataCochonnet)
          //TODO: remove dirty code:
          if(gameData.playerTurn === gameData.playerTurns.PLAYER1) collisionAirLeft =true
          if(gameData.playerTurn === gameData.playerTurns.PLAYER2) collisionAirRight =true


        }else{
          throwball.calulateNextPositionObliqueThrow(dt, wind.speed *0, throwball)
        }


        checkCollisionWithSegments(throwball, segmentArray, segmentBallData)
        if(segmentBallData._segment ){
         state.state = state.ONSLOPE
        }

        cochonnet.calulateNextPositionOnSlope(dt , cochonnetSegmentBallData)

        if(otherThrowBallState.state === otherThrowBallState.ONSLOPE){
            otherThrowBall.calulateNextPositionOnSlope(dt, otherSegmentBallData)
        }
       
       break
      }

      //------------------- ONSLOPE --------------------------------
      case state.ONSLOPE:{
        let deltaTimeOverLimitThrowball = 0
        let deltaTimeOverLimitOtherThrowball = 0
        let deltaTimeOverLimitCochonnet = 0

        let timeUntilCollisionThrowball = 0
        let timeUntilCollisionOtherThrowball = 0
        let timeUntilCollisionCochonnet = 0

        //TODO: overlimit check after movement, makes the movement more fluent, currently 1 frame lag
         deltaTimeOverLimitThrowball = handleMovementOverSegmentLimits(throwball, segmentBallData)
         deltaTimeOverLimitCochonnet = handleMovementOverSegmentLimits(cochonnet, cochonnetSegmentBallData)
         if(otherThrowBallState.state === otherThrowBallState.ONSLOPE)
         deltaTimeOverLimitOtherThrowball = handleMovementOverSegmentLimits(otherThrowBall, otherSegmentBallData)
        
        
       
        if(throwball.isCoastDown() && otherThrowBall.isCoastDown() && cochonnet.isCoastDown()) {
          gameData.nextTurn()
          if(gameData.playerTurn!= gameData.playerTurns.GAMEEND)
          wind.updateSpeed()
          //TODO: direct collenction of wind to gameData, change of wind in nextTurn?
        }

        
        //check for collisions between last and this frame
          //WARNING: 2 collisions cannot happen in 1 frame or there will be an error
        if(collisionBalls(throwball, cochonnet, dt)){
          console.log("collision")
          let timeUntilCollision = collisionCase(throwball, cochonnet, segmentBallData, cochonnetSegmentBallData)
          timeUntilCollisionThrowball = timeUntilCollision
          timeUntilCollisionCochonnet = timeUntilCollision
        }
        else {
          console.log()
          switch(otherThrowBallState.state){
            case otherThrowBallState.ONSLOPE:{
              
              if(collisionBalls(throwball, otherThrowBall, dt)){
                console.log("collision")
                console.log("stuff")
                let timeUntilCollision = collisionCase(throwball, otherThrowBall, segmentBallData, otherSegmentBallData)
                timeUntilCollisionThrowball = timeUntilCollision
                timeUntilCollisionOtherThrowball = timeUntilCollision
              }
              else if(collisionBalls(otherThrowBall, cochonnet, dt)){
                console.log("collision")
                let timeUntilCollision = collisionCase(otherThrowBall, cochonnet, otherSegmentBallData, cochonnetSegmentBallData)
                timeUntilCollisionOtherThrowball = timeUntilCollision
                timeUntilCollisionCochonnet = timeUntilCollision
              }
            }
          }
      }
        
        throwball.calulateNextPositionOnSlope(dt - deltaTimeOverLimitThrowball - timeUntilCollisionThrowball, segmentBallData)
        cochonnet.calulateNextPositionOnSlope(dt - deltaTimeOverLimitCochonnet- timeUntilCollisionCochonnet, cochonnetSegmentBallData)
        switch(otherThrowBallState.state){
          case otherThrowBallState.ONSLOPE:
            otherThrowBall.calulateNextPositionOnSlope(dt - deltaTimeOverLimitOtherThrowball- timeUntilCollisionOtherThrowball, otherSegmentBallData)
        }

      }
      

    }
}
function handleMovementOverSegmentLimits(throwball, segmentBallData){
  let deltaTimeOverLimit =0;
  if(segmentBallData.overLeftLimit()) {
    let deltaS = segmentBallData._segment.getLimiterLeft()-segmentBallData._pointOnSegment
    deltaTimeOverLimit = Math.abs( deltaS / throwball.getOnSlopeVelocity(segmentBallData))
    segmentBallData =  segmentBallData.dataForStartOnLeftSegment()
  }
  else if(segmentBallData.overRightLimit()){
    let deltaS = segmentBallData._pointOnSegment - segmentBallData._segment.getLimiterRight()
    deltaTimeOverLimit = Math.abs(deltaS / throwball.getOnSlopeVelocity(segmentBallData))
    segmentBallData = segmentBallData.dataForStartOnRightSegment()
  }
  return deltaTimeOverLimit
}



function collisionCase(ball1, ball2, segmentBallData1, segmentBallData2){
  //TODO: balls get stuck in each other so the collisioncalulation cannot be so accurate
  //the balls are not moved close do each other before the collision, the collision happens when there is still a random distance  (that will be crossed between the 2 frames of the collision) between them
  //TODO: timeUntilCollision shopuld be used
  let timeUntilCollision = collisionTimeBalls2D(ball1, ball2)
   //ball1.calulateNextPositionOnSlope(timeUntilCollision, segmentBallData1)
   //ball2.calulateNextPositionOnSlope(timeUntilCollision, segmentBallData2)
  calculateCollisionBallsOnSegment(ball1, ball2)
  return 0//timeUntilCollision
}


function mouseClicked(){
  mClicked=true;
}

function mousePressed(){
  	mPressed=true;
    mReleased = false;

  
}

function mouseReleased(){
  mReleased=true;
  mPressed=false;
  mClicked=false;

}


function windowResized(){
  canvasWidth = window.innerWidth
  canvasHeight = window.innerHeight 
  resizeCanvas(canvasWidth,canvasHeight)
}








window.setup = setup
window.draw = draw
window.mouseClicked = mouseClicked
window.mousePressed = mousePressed
window.mouseReleased = mouseReleased
window.windowResized = windowResized

window.kXi = kXi
window.kYi = kYi
window.iXk = iXk
window.iYk = iYk
