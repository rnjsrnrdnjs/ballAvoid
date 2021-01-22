var NBALL = 0; // 공의 개수
var R; // 공의 반지름
var BACK_ALPHA = 0.3; // 배경의 α 값
var canvas;
var ctx;
var wall;
// 공 객체를 NBALL 개 만들어 배열 balls에 저장
var balls = [];
var rdimg = [] ;
var myball = {};
var TIME_INTERVAL = 33;
var maxHigh = 0;
var high, low;
var bP, raf ,itP;
var tof = true;
//컨트롤바
var moveX, moveY;
var downclick=false;
var playTrue=false;
var stp,ght,grd,sup;
function disableScroll() {
	document.body.classList.add('stop-scrolling');
}
window.onload = function () {
	// 각종 매개변수
	let stopScroll = disableScroll();
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	R = 1;
	wall = { left: 0, right: canvas.width, top: 0, bottom: canvas.height };
	high = document.getElementById('high');
	high.innerHTML = `최고점수 : ${maxHigh}`;

	myball = new Ball(wall.right / 4, wall.bottom / 4, R + 2);
	myball.setColor(1);
	myball.collisionWall(wall).draw(ctx);
	stp=new Image();
	stp.src="../img/stp.svg";
	ght=new Image();
	ght.src="../img/ght.svg";
	grd=new Image();
	grd.src="../img/grd.svg";
	sup=new Image();
	sup.src="../img/sup.svg";
	
	
	
	var one = document.getElementById('one');
	one.addEventListener('touchstart', down,false);
	one.addEventListener('touchmove', move,false);
	one.addEventListener('touchend', up,false);
	one.addEventListener('mousedown', down,false);
	one.addEventListener('mousemove', move,false);
	one.addEventListener('mouseup', up,false);
	var ctx5 = one.getContext('2d');
	ctx5.lineWidth = 2;

	clearBackground();
	clearBackground2(0, 0);
	drawCircle(one.width / 2, one.height / 2, one.height / 5, 'rgb(0,255,255)');
	var startX;
	var	startY;
		moveX = 0,
		moveY = 0;
	var joyPos = one.getBoundingClientRect();
	var onTouch = false;
	function down(event) {
		try {
			startX = Math.round(event.touches[0].clientX - joyPos.left);
			startY = Math.round(event.touches[0].clientY - joyPos.top);
		} catch {
			startX = Math.round(event.clientX - joyPos.left);
			startY = Math.round(event.clientY - joyPos.top);
		}
		onTouch = true;
	}




	var moveMax = one.height / 4;
	function move(event) {
		if (onTouch) {
			try {
				moveX = Math.round(event.touches[0].clientX - joyPos.left) - startX;
				moveY = Math.round(event.touches[0].clientY - joyPos.top) - startY;
			} catch {
				moveX = Math.round(event.clientX - joyPos.left) - startX;
				moveY = Math.round(event.clientY - joyPos.top) - startY;
			}

			if (moveX > moveMax) moveX = moveMax;
			else if (moveX < -moveMax) moveX = -moveMax;
			if (moveY > moveMax) moveY = moveMax;
			else if (moveY < -moveMax) moveY = -moveMax;

			clearBackground();
			clearBackground2(moveX, moveY);
			drawCircle(
				one.width / 2 + moveX,
				one.height / 2 + moveY,
				one.height / 5,
				'rgb(0,255,255)'
			);
			
			// 공움직이는 이벤트 추가
		}
	}
	// onTouch 일때 커스터마이징 이벤트 ㄱㄱ
	function up() {
		clearBackground();
		clearBackground2(0, 0);
		drawCircle(one.width / 2, one.height / 2, one.height / 5, 'rgb(0,255,255)');
		onTouch = false;
		moveY=0;
		moveX=0;
	}
	function clearBackground() {
		ctx5.clearRect(0, 0, one.width, one.height);
		ctx5.beginPath();
		ctx5.strokeStyle = 'rgb(0,0,0)';
		ctx5.arc(one.width / 2, one.height / 2, one.height / 2, 0, 2 * Math.PI);
		ctx5.stroke();
	}
	function clearBackground2(mx, my) {
		ctx5.beginPath();
		ctx5.strokeStyle = 'rgb(0,255,255)';
		ctx5.arc(one.width / 2 + mx, one.height / 2 + my, one.height / 4, 0, 2 * Math.PI);
		ctx5.stroke();
	}
	function drawCircle(x, y, r, c) {
		ctx5.beginPath();
		ctx5.fillStyle = c;
		ctx5.arc(x, y, r, 0, 2 * Math.PI);
		ctx5.fill();
	}
	var str=document.getElementById("start");
	str.addEventListener('click',(e)=>{
		start();
	},false);
};
function start() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	while(balls.length){
		balls.pop();
	}
	myball = new Ball(wall.right / 4, wall.bottom / 4, R + 2);
	myball.setColor(1);
	myball.collisionWall(wall).draw(ctx);
	tof=true;
	bP = setInterval(ballPush, 5000);
	itP=setInterval(itemPush,20000);
	raf = requestAnimationFrame(draw);
}
function end() {
	clearInterval(bP);
	clearInterval(itP);
	while(balls.length){
		balls.pop();
	}
	maxHigh = Math.max(maxHigh, balls.length);
	cancelAnimationFrame(raf);
	high.innerHTML = `최고점수 : ${maxHigh}`;
	//문구 하나 작성 
	ctx.font = "30px verdana";
    ctx.strokeStyle = "white"; //테두리 색상
    ctx.strokeText("Game Over",canvas.width/5,canvas.height/5);
    ctx.strokeText(`현재점수:${balls.length}`,canvas.width/5,canvas.height/2);
}

function draw() {
	//공과 공 맞닿은 처리
	if (!tof) return;
	for(var i=0;i<rdimg.length;i++){
		if(rdimg[i].state==0){
			ctx.drawImage(stp,rdimg[i].width,rdimg[i].height,10,10);
		}
		else if(rdimg[i].state==1){
			ctx.drawImage(ght,rdimg[i].width,rdimg[i].height,10,10);
		}
		else if(rdimg[i].state==2){
			ctx.drawImage(grd,rdimg[i].width,rdimg[i].height,10,10);
		}
		else if(rdimg[i].state==3){
			ctx.drawImage(sup,rdimg[i].width,rdimg[i].height,10,10);
		}
	}
	
	for (let i = 0; i < balls.length; i++) {
		if (
			Math.sqrt(
				Math.abs(myball.y - balls[i].y) * Math.abs(myball.y - balls[i].y) +
					Math.abs(myball.x - balls[i].x) * Math.abs(myball.x - balls[i].x)
			) <=
			myball.r + balls[i].r
		) {
			end();
			tof = false;
			return;
		}
	}
	drawFrame();
	requestAnimationFrame(draw);
}
function drawFrame() {
	// 배경을 검은색으로 칠한다
	myball.x+=moveX/40;
    myball.y+=moveY/40;
	myball.collisionWall(wall).draw(ctx);

	ctx.fillStyle = 'rgba(0,0,0,' + BACK_ALPHA + ')';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//myball.move().collisionWall(wall).draw(ctx);
	// 공의 위치를 ​갱신하여 그린다
	for (i = 0; i < balls.length; i++) {
		balls[i].move().collisionWall(wall).draw(ctx);
	}
	low = document.getElementById('low');
	low.innerHTML = `현재점수 : ${balls.length}`;
}
function ballPush() {
	var cball = new Ball(wall.right / 2, wall.bottom / 2, R);
	cball.setVelocityAsRandom(0.2, 0.5).setColor(0);
	balls.push(cball);
}
function itemPush(){
	var rd=Math.floor(Math.random()*4);
	var w=Math.random()*canvas.width-30;
	var h=Math.random()*canvas.height-30;
	if(rd==0) rdimg.push({state:0,width:w,height:h});
	else if(rd==1) rdimg.push({state:1,width:w,height:h});
	else if(rd==2) rdimg.push({state:2,width:w,height:h});
	else if(rd==3) rdimg.push({state:3,width:w,height:h});
}

// Ball 생성자
function Ball(x, y, r, vx, vy, color) {
	this.x = x; // 공의 x좌표
	this.y = y; // 공의 y좌표
	this.r = r; // 공의 반지름
	this.vx = vx; // 공 속도의 x성분
	this.vy = vy; // 공 속도의 y성분
	this.color = color; // 공의 색상
}
// Ball 생성자의 프로토타입
Ball.prototype = {
	// 속도를 임의로 설정
	setVelocityAsRandom: function (vmin, vmax) {
		var v = vmin + Math.random() * (vmax - vmin);
		var t = 2 * Math.PI * Math.random();
		this.vx = v * Math.cos(t);
		this.vy = v * Math.sin(t);
		return this;
	},
	// 색상을 임의로 설정
	setColor: function (ch) {
		if (ch) this.color = 'rgb(' + 0 + ',' + 255 + ',' + 255 + ')';
		else this.color = 'rgb(' + 255 + ',' + 0 + ',' + 0 + ')';
		return this;
	},
	// 공 그리기
	draw: function (ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
		ctx.fill();
		return this;
	},
	// 공의 위치를 갱신
	move: function () {
		this.x += this.vx;
		this.y += this.vy;
		return this;
	},
	// 벽과 공의 충돌
	collisionWall: function (wall) {
		if (this.x - this.r < wall.left) {
			// 왼쪽 벽과 충돌했을 때
			this.x = wall.left + this.r;
			if (this.vx < 0) this.vx *= -1;
		}
		if (this.x + this.r > wall.right) {
			// 오른쪽 벽과 충돌했을 때
			this.x = wall.right - this.r;
			if (this.vx > 0) this.vx *= -1;
		}
		if (this.y - this.r < wall.top) {
			// 위쪽 벽과 충돌했을 때
			this.y = wall.top + this.r;
			if (this.vy < 0) this.vy *= -1;
		}
		if (this.y + this.r > wall.bottom) {
			// 아래쪽 벽과 충돌했을 때
			this.y = wall.bottom - this.r;
			if (this.vy > 0) this.vy *= -1;
		}
		return this;
	},
};