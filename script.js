const canvas=document.getElementById("pong");
const context=canvas.getContext("2d");


function drawRect(x,y,w,h,color){	//Function to draw a rectangle
context.fillStyle=color;
context.fillRect(x,y,w,h);
}
function drawCircle(x,y,r,color){
	context.fillStyle=color;
	context.beginPath();
	context.arc(x,y,r,0,Math.PI*2,false);
	context.closePath();
	context.fill();
}
function drawText(text,x,y,color){
	context.fillStyle=color;
	context.font="75px fantasy";
	context.fillText(text,x,y);
}
const user={
	x:0,
	y:canvas.height/2-100/2,
	width:10,
	height:100,
	color:"WHITE",
	score:0
}
const com={
	x:canvas.width-10,
	y:canvas.height/2-100/2,
	width:10,
	height:100,
	color:"WHITE",
	score:0
}
//Drawing the net in  between
const net={
	x:canvas.width/2-2/2,
	y:0,
	width:2,
	height:10,
	color:"WHITE"
}
function drawNet(){
	for (let i =0; i<=canvas.height; i+=15) {
		drawRect(net.x,net.y+i,net.width,net.height,net.color);
	}
}
//Create the ball
const ball={
	x:canvas.width/2,
	y:canvas.height/2,
	radius:10,
	speed:5,
	velocityX:5,
	velocityY:5,
	color:"WHITE"
}
function resetBall(){
	ball.x=canvas.width/2;
	ball.y=canvas.height/2;

	ball.speed=5;
	ball.velocityX=-ball.velocityX;
}
//Render the Game
function render(){
	drawRect(0,0,canvas.width,canvas.height,"BLACK");
	drawRect(user.x,user.y,user.width,user.height,user.color);
	drawRect(com.x,com.y,com.width,com.height,com.color);
	drawNet();
	drawCircle(ball.x,ball.y,ball.radius,ball.color);
	drawText(user.score,canvas.width/4,canvas.height/5,"WHITE");
	drawText(com.score,3*canvas.width/4,canvas.height/5,"WHITE");
}
//Update function
canvas.addEventListener("mousemove",movePaddle);
function movePaddle(evt){
	let rect=canvas.getBoundingClientRect();
	user.y=evt.clientY-rect.top-user.height/2;
}
function collision(b,p){
	b.top=b.y-b.radius;
	b.bottom=b.y+b.radius;
	b.left=b.x-b.radius;
	b.right=b.x+b.radius;

	p.top=p.y;
	p.bottom=p.y+p.height;
	p.left=p.x;
	p.right=p.x+p.width;

	return b.right>p.left && b.bottom>p.top && b.left<p.right && b.top<p.bottom;
}
function update(){
	ball.x+=ball.velocityX;
	ball.y+=ball.velocityY;

	let computerLevel=0.1;
	com.y+=(ball.y-(com.y+com.height/2))*computerLevel;

	if(ball.y+ball.radius>canvas.height || ball.y-ball.radius<0){
		ball.velocityY=-ball.velocityY;
	}
	let player=(ball.x<canvas.width/2)?user:com;

	if(collision(ball,player)){
		let collidePoint=ball.y-(player.y+player.height/2);
		collidePoint=collidePoint/(player.height/2);
		//calculate angle in radian
		let angleRad=collidePoint*Math.PI/4;
		//X direction of ball when its hit
		let direction=(ball.x<canvas.width/2)?1:-1;
		//change velocity X and Y
		ball.velocityX=direction*ball.speed*Math.cos(angleRad);
		ball.velocityY=direction*ball.speed*Math.sin(angleRad);
		//everytime the ball hits the paddle we increase its speed
		ball.speed+=0.5;
		}
		if(ball.x-ball.radius<0){
			com.score++;
			resetBall();
		}
		else if(ball.x+ball.radius>canvas.width){
			user.score++;
			resetBall();
		}
}
function game(){
	update();
	render();
}
const framePerSecond=50;
setInterval(game,1000/framePerSecond);//Call game();50  times every 1000ms=1sec 

