var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.z = 10;

var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );

document.body.appendChild(renderer.domElement);


//adding shapes -- paddle is the singleplayer paddle, paddle 1 and 2 are the multiplayer paddles
//ball is the ball...same one used in both SP and MP

var geometry = new THREE.BoxGeometry(1, 6, 1);
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var paddle = new THREE.Mesh( geometry, material );

const edges = new THREE.EdgesGeometry(geometry);
const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

var spheregeo = new THREE.SphereGeometry( 0.5, 8, 6 );
var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
var ball = new THREE.Mesh( spheregeo, material );

var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
var paddle1 = new THREE.Mesh( geometry, material );

const edges1 = new THREE.EdgesGeometry(geometry);
const lines1 = new THREE.LineSegments( edges1, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var paddle2 = new THREE.Mesh( geometry, material );

const edges2 = new THREE.EdgesGeometry(geometry);
const lines2 = new THREE.LineSegments( edges2, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

var score1 = 0;
var score2 = 0;

var playSide;

var hasOp = false;

var prevTime = 0;

var mbX = 0;
var mbY = 0;

var mvX = 0;
var mvY = 0;

var hasCollided = false;

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

document.getElementById("opLeftText").style.visibility = "hidden";

document.getElementById("gameovertext").style.visibility = "hidden";

document.getElementById("multiscore").style.visibility = "hidden";


//depending on the gamemode, certain paddles need to be added to the screen
var singleplayersetup = function (){

    document.getElementById("singleplay").style.visibility = "hidden";
    document.getElementById("multiplay").style.visibility = "hidden";
    document.getElementById("title").style.visibility = "hidden";

    paddle.position.x -= 6.0;
    scene.add( paddle );
    scene.add( ball );

    line.position.x -= 6.0
    scene.add(line);

};

var multiplayersetup = function (){

    document.getElementById("singleplay").style.visibility = "hidden";
    document.getElementById("multiplay").style.visibility = "hidden";
    document.getElementById("title").style.visibility = "hidden";
    
    document.getElementById("multiscore").style.visibility = 'visible';
    document.getElementById("multiscore").innerHTML = "0 - 0";

    s = new pongServer("insert ip here", "insert port here", ballCoordFunction, opPaddle, playerLeft, startGame);

    scene.add( paddle1 );
    scene.add( paddle2 );
    scene.add( ball );

    scene.add(lines1);
    scene.add(lines2);

    window.setTimeout(function(){

        s.findGame();


    }, 500);

};

function ballCoordFunction (x, y, xVel, yVel){

    mbX = parseFloat(x);
    mbY = parseFloat(y);
    mvX = parseFloat(xVel);
    mvY = parseFloat(yVel);
    hasCollided = true;
    
};

function opPaddle(x, y){

    if (playSide == 0){
        paddle2.position.x = x;
        paddle2.position.y = y;
        lines2.position.x = x;
        lines2.position.y = y;
    }

    if (playSide == 1){
        paddle1.position.x = x;
        paddle1.position.y = y;
        lines1.position.x = x;
        lines1.position.y = y;
    }

    
};

function playerLeft(){

    document.getElementById("opLeftText").style.visibility = "visible";

    hasOp = false;

    if (playSide == 0){
        scene.remove(paddle2);
        }
    
    if (playSide == 1){
        scene.remove(paddle1);
    }


    
};

 function startGame(screenSide){

    hasOp = true;

    playSide = screenSide;
    
    if (playSide == 0){

        paddle1.position.x -= 8.0;
        lines1.position.x -= 8.0;
        s.movePaddle(paddle1.position.x, paddle1.position.y);
        


    }

    else if (playSide == 1){

        paddle2.position.x += 8.0;
        lines2.position.x += 8.0;
        s.movePaddle(paddle2.position.x, paddle2.position.y);

    }



 }

var wpressed = false;
var spressed = false;

var uppressed = false;
var downpressed = false;


var ydist = 0;
var angle = 0;

var speed = 0.3;

var xspeed = -0.3;

var yspeed = 0;

//checking w or s are pressed

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 87) {
        wpressed = true;
        
    }
    else if(event.keyCode == 83) {
        spressed = true;
    }

    if(event.keyCode == 88){

        alert("ydist =" + ydist + "\nyspeed = " + yspeed +"\nxspeed = " + xspeed);
    }

});

document.addEventListener('keyup', function(event) {

    if (event.keyCode == 87){
        wpressed = false;
    }
    else if (event.keyCode == 83){
        spressed = false;
    }

});

//checking if uparrow or downarrow are pressed

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 38) {
        uppressed = true;
        
    }
    else if(event.keyCode == 40) {
        downpressed = true;
    }

    if(event.keyCode == 88){

        alert("ydist =" + ydist + "\nyspeed = " + yspeed +"\nxspeed = " + xspeed);
    }

});

document.addEventListener('keyup', function(event) {

    if (event.keyCode == 38){
        uppressed = false;
    }
    else if (event.keyCode == 40){
        downpressed = false;
    }

});




//code for singleplayer

var singleplayer = function () {

    requestAnimationFrame( singleplayer );

    //ball movement
    ball.position.x += xspeed;
    ball.position.y += yspeed;

    //moving the paddle - limit set at 5 and -5
    if (wpressed && paddle.position.y < 4){

        paddle.position.y += 0.3;
        line.position.y += 0.3;

    }

    else if(spressed && paddle.position.y > -4){
        paddle.position.y -= 0.3;
        line.position.y -= 0.3;

    }

    //hit detection
    var xcondition = ball.position.x > paddle.position.x && ball.position.x < paddle.position.x + 1;
    var ycondition = paddle.position.y-3 <= ball.position.y && ball.position.y <= (paddle.position.y + 3);

    //setting ball's yspeed and xspeed after collision
    if (xcondition && ycondition)
    {
        
    ydist = ball.position.y - paddle.position.y;


    yspeed = -speed * (ydist / 3);
    xspeed = Math.abs(speed * (1 - Math.abs(ydist / 3)));

    //yspeed = Math.sin(angle) * speed;
    //xspeed = Math.sin(angle) * speed;

    }

    if (ball.position.x > 15)
    {
    xspeed = xspeed * -1;
    }

    if (ball.position.x < -15)
    {
    scene.remove(ball);
    scene.remove(paddle);
    document.getElementById("gameovertext").style.visibility = 'visible';

    }


    if (ball.position.y > 7 || ball.position.y < -7){
        yspeed = yspeed * -1;
    }


    ball.rotation.y += 0.01;
    ball.rotation.x += 0.01;
    ball.rotation.z += 0.01;

    renderer.render( scene, camera );
};



var multiplayer = function () {

    requestAnimationFrame( multiplayer );

    //moving paddle1 - limit set at 5 and -5

    if (hasCollided == true){
        ball.position.x = mbX;
        ball.position.y = mbY;
        hasCollided = false;
    }

    console.log(hasCollided);

    ball.position.x += mvX;
    ball.position.y += mvY;


    console.log(ball.position.x + ", " + ball.position.y);

    if (playSide == 0){

        if (wpressed && paddle1.position.y < 4){

            paddle1.position.y += 0.3;
            lines1.position.y += 0.3;

            if (hasOp){
            s.movePaddle(paddle1.position.x, paddle1.position.y);
            }
        }

        else if(spressed && paddle1.position.y > -4){

            paddle1.position.y -= 0.3;
            lines1.position.y -= 0.3;

            if (hasOp){
            s.movePaddle(paddle1.position.x, paddle1.position.y);
            }
        }
    }

    else if (playSide == 1){

        if (wpressed && paddle2.position.y < 4){
            paddle2.position.y += 0.3;
            lines2.position.y += 0.3;

            if (hasOp){
            s.movePaddle(paddle2.position.x, paddle2.position.y);
            }

        }

        else if(spressed && paddle2.position.y > -4){

            paddle2.position.y -= 0.3;
            lines2.position.y -= 0.3;


            if (hasOp){
            s.movePaddle(paddle2.position.x, paddle2.position.y);
            }
        }
    }
 
/*
    //moving paddle2 - limit set at 5 and -5
    if (uppressed && paddle2.position.y < 4){

        paddle2.position.y += 0.3;

    }

    else if(downpressed && paddle2.position.y > -4){
        paddle2.position.y -= 0.3;

    }

    //hit detection
    var p1xcondition = ball.position.x > paddle1.position.x && ball.position.x < paddle1.position.x + 1;
    var p1ycondition = paddle1.position.y-3 <= ball.position.y && ball.position.y <= (paddle.position.y + 3);

    //setting ball's yspeed and xspeed after collision
    if (p1xcondition && p1ycondition)
    {
        
    ydist = ball.position.y - paddle1.position.y;

    yspeed = -speed * (ydist / 3);
    xspeed = Math.abs(speed * (1 - Math.abs(ydist / 3)));

    //yspeed = Math.sin(angle) * speed;
    //xspeed = Math.sin(angle) * speed;

    }

    var p2xcondition = ball.position.x < paddle2.position.x && ball.position.x > paddle2.position.x - 1;
    var p2ycondition = paddle2.position.y-3 <= ball.position.y && ball.position.y <= (paddle2.position.y + 3);

    //setting ball's yspeed and xspeed after collision
    if (p2xcondition && p2ycondition)
    {

    ydist = ball.position.y - paddle2.position.y;
        
    yspeed = speed * (ydist / 3);
    xspeed = -1*Math.abs(speed * (1 - Math.abs(ydist / 3)));

    }

    if (ball.position.x > 15)
    {
    xspeed = xspeed * -1;
    }

    if (ball.position.x < -15)
    {
    scene.remove(ball);
    scene.remove(paddle);
    document.getElementById("gameovertext").style.visibility = 'visible';

    }
*/

    ball.rotation.y += 0.01;
    ball.rotation.x += 0.01;
    ball.rotation.z += 0.01;

    renderer.render( scene, camera );
};


document.getElementById("singleplay").addEventListener("click", singleplayersetup);
document.getElementById("singleplay").addEventListener("click", singleplayer);

document.getElementById("multiplay").addEventListener("click", multiplayersetup);
document.getElementById("multiplay").addEventListener("click", multiplayer);

//animate();

