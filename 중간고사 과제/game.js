// 게임의 상태 변수
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var obstacles = []; // 장애물들을 저장하는 배열
var food = { x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: 15 }; // 먹이의 위치와 크기
var mouseX = 0, mouseY = 0; // 마우스 위치
var circles = [
{ x: 50, y: 50, speed: 0.016, color: '#A0522D' },
{ x: 70, y: 70, speed: 0.02, color: '#A0522D' },
{ x: 90, y: 90, speed: 0.024, color: '#A0522D' },]; // 게임 내 원들(스네이크의 몸통)을 저장하는 배열
var startTime = Date.now(); // 게임 시작 시간
var timeEl = document.getElementById('time'); // 시간을 표시할 엘리먼트
var lengthEl = document.getElementById('length'); // 길이를 표시할 엘리먼트
var isGameOver = false; // 게임 오버 상태
var backgroundImg = new Image();  // 배경 이미지 객체를 생성
//마우스 클릭 별 이벤트 변수
var speedGauge = document.getElementById('speedGauge');
var speedGaugeMax = 100; // 게이지 최대치
var currentSpeedGauge = speedGaugeMax; // 현재 게이지 값
var speedMultiplier = 1;
var isMouseDown = false; // 마우스가 눌려있는지 상태를 추적하는 변수
//먹이 변수
var appleDiameter = food.radius * 2; // 사과의 지름을 먹이의 반지름으로 설정
//스네이크 변수
var eyeRadius = 5; // 눈의 설정값
var eyeOffsetX = 10;
var eyeOffsetY = -5;
var pupilRadius = 2;

// 시작 및 종료 버튼에 대한 이벤트 
document.getElementById('startButton').addEventListener('click', startGame);  // 시작 버튼에 게임 시작 함수를 연결
document.getElementById('endButton').addEventListener('click', endGame);  // 종료 버튼에 게임 종료 함수를 연결

// 초기화
window.onload = function () {  // 윈도우 로드 시 실행될 초기화 함수

    document.getElementById('gameCanvas').style.display = 'none'; // 로드 시 게임 캔버스 숨기기
};

// 이미지가 로드되면 캔버스에 그린다.
backgroundImg.onload = function () {  // 배경 이미지가 로드되었을 때 실행될 함수
    context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
};

// 이미지의 소스를 설정하여 로드를 시작
backgroundImg.src = 'BackGround.png'; // 이미지 파일의 경로는 서버 상의 위치에 따라 달라진다.



// 게임 시작 함수
function startGame() {
    isGameOver = false;
    circles = [];
    currentSpeedGauge = speedGaugeMax;
    updateSpeedGauge();
    document.getElementById('gameStartScreen').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    document.body.classList.remove('gameOver');
    obstacles = [];
    initGame();
}

// 게임 종료 함수
function endGame() {
    window.close();
}

// 게임 초기화 함수
function initGame() {
    circles = [
        { x: 50, y: 50, radius: 20, speed: 0.016, color: '#A0522D' },
        { x: 70, y: 70, radius: 20, speed: 0.02, color: '#A0522D' },
        { x: 90, y: 90, radius: 20, speed: 0.024, color: '#A0522D' },
    ];
    obstacles = [];
    food = { x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: 15 };
    startTime = Date.now();
    lengthEl.innerText = circles.length;
    timeEl.innerText = 0;
    speedMultiplier = 1;
    if (window.animationFrameId) {
        cancelAnimationFrame(window.animationFrameId);
    }
    GameLoop();
}

// 게임 오버 처리 함수
function gameOver() {
    if (isGameOver) return;
    isGameOver = true;
    alert("응 게임오버! 그래서 님 점수는?: " + circles.length + "점");
    document.getElementById('gameCanvas').style.display = 'none';
    let gameStartScreen = document.getElementById('gameStartScreen');
    gameStartScreen.style.display = 'flex';
    document.body.classList.add('gameOver');
}

// 게임 루프 함수
function GameLoop() {

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    if (Math.random() < 0.009) { // 장애물 랜덤 생성
        setTimeout(createObstacle,2000);
    }

    // 마우스가 눌려있고 게이지가 남아있다면 속도를 증가시키고 게이지를 감소시킴
    if (isMouseDown && currentSpeedGauge > 0) {
        speedMultiplier = 5;
        currentSpeedGauge -= 1; // 이 값을 조절하여 감소 속도를 제어할 수 있음
        updateSpeedGauge();
    } else {
        // 마우스를 놓았거나 게이지가 다 소모된 경우 속도를 원래대로 돌린다.
        speedMultiplier = 1;
    }

    // 게이지를 시간이 지남에 따라 회복
    if (currentSpeedGauge < speedGaugeMax) {
        currentSpeedGauge += 0.1; // 게이지 회복 속도 조절
        updateSpeedGauge();
    }

    obstacles.forEach(drawObstacle);
    checkObstacleCollision();
    updateDifficulty();
    circles.forEach((circle, idx) => drawCircle(circle, idx));
    drawFood();
    updateTimer();
    window.animationFrameId = requestAnimationFrame(GameLoop);

}

//스네이크 관련 함수
// 원을 그리는 함수
function drawCircle(circle, idx) {
    // console.log("Drawing circle:", idx, circle); // 디버깅을 위한 로그
    // 머리를 제외한 몸통은 이전 몸통의 위치를 따라갑니다.
    if (idx > 0) {
        var prevCircle = circles[idx - 1];
        circle.x = prevCircle.x - 20 * Math.cos(Math.atan2(prevCircle.y - circle.y, prevCircle.x - circle.x));
        circle.y = prevCircle.y - 20 * Math.sin(Math.atan2(prevCircle.y - circle.y, prevCircle.x - circle.x));
    }  else {
        // 뱀 머리의 움직임 로직
        var fixedSpeed = 1; // 기본 속도 고정
        var angle = Math.atan2(mouseY - circle.y, mouseX - circle.x);
        circle.x += Math.cos(angle) * fixedSpeed * speedMultiplier; // speedMultiplier를 곱하여 속도 조절
        circle.y += Math.sin(angle) * fixedSpeed * speedMultiplier; // speedMultiplier를 곱하여 속도 조절
    }
    if (idx === 0 && speedMultiplier > 1) {
        context.beginPath();
        context.arc(circle.x, circle.y, 20 + 5, 0, 2 * Math.PI, false);
        context.strokeStyle = 'rgba(255, 215, 0, 0.8)'; // 스프린트 효과를 나타내는 후광
        context.lineWidth = 5;
        context.stroke();
    }
    // 뱀의 머리에 대한 장애물 충돌 검사
    if (idx === 0 && checkCollisionWithObstacle(circle)) {
        gameOver();
        return; // 추가된 원을 더 이상 그리지 않음
    }
    // 원 그리기
    context.beginPath();
    context.arc(circle.x, circle.y, 20, 0, 2 * Math.PI, false);
    context.fillStyle = circle.color;
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#003300';
    context.stroke();
    // 뱀의 머리에 대해서만 충돌 검사를 수행합니다. 또는 뱀의 머리에 눈그리기를 추가
    if (idx === 0) {
       
        // 왼쪽 눈
        context.beginPath();
        context.arc(circle.x - eyeOffsetX, circle.y + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        context.fillStyle = 'white';
        context.fill();
        context.closePath();

        // 왼쪽 눈의 동공
        context.beginPath();
        context.arc(circle.x - eyeOffsetX, circle.y + eyeOffsetY, pupilRadius, 0, Math.PI * 2);
        context.fillStyle = 'black';
        context.fill();
        context.closePath();

        // 오른쪽 눈
        context.beginPath();
        context.arc(circle.x + eyeOffsetX, circle.y + eyeOffsetY, eyeRadius, 0, Math.PI * 2);
        context.fillStyle = 'white';
        context.fill();
        context.closePath();

        // 오른쪽 눈의 동공
        context.beginPath();
        context.arc(circle.x + eyeOffsetX, circle.y + eyeOffsetY, pupilRadius, 0, Math.PI * 2);
        context.fillStyle = 'black';
        context.fill();
        context.closePath();

        // 먹이 충돌 검사
        checkCollisionWithFood(circle, idx);
    }
}
// 새로고침 시 게임 초기화
window.onload = initGame;

//먹이 관련 함수
function drawFood() {  // 먹이를 캔버스에 그리는 함수

    // 사과 본체
    context.beginPath();
    context.arc(food.x, food.y, appleDiameter / 2, 0, Math.PI * 2);
    context.fillStyle = '#FF0000'; // 사과의 색상
    context.fill();
    context.closePath();

    // 사과의 하이라이트
    context.beginPath();
    context.arc(food.x - 5, food.y - 3, 6, 0, Math.PI * 2);
    context.fillStyle = 'rgba(255, 255, 255, 0.4)'; // 흰색의 투명한 색으로 설정
    context.fill();
    context.closePath();

    // 사과 꼭지
    context.beginPath();
    context.moveTo(food.x, food.y - 10); // 꼭지의 시작점
    context.lineTo(food.x, food.y - 15); // 꼭지의 끝점
    context.strokeStyle = 'brown'; // 갈색으로 설정
    context.lineWidth = 5; // 선의 굵기
    context.stroke();
    context.closePath();

    // 사과 잎사귀
    context.beginPath();
    context.arc(food.x - 5, food.y - 15, 5, 0, Math.PI, true); // 왼쪽 잎사귀
    context.fillStyle = 'green'; // 초록색으로 설정
    context.fill();
    context.closePath();

    context.beginPath();
    context.arc(food.x + 5, food.y - 15, 5, 0, Math.PI, true); // 오른쪽 잎사귀
    context.fill();
    context.closePath();
}

// 먹이와의 충돌 검사 함수
function checkCollisionWithFood(circle, idx) {
    if (idx !== 0) return; // 뱀의 머리와만 충돌 검사를 수행

    var dx = circle.x - food.x;
    var dy = circle.y - food.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle.radius + food.radius) {
    
        // 먹이를 먹었으므로 새로운 위치에 먹이를 배치
        food.x = Math.random() * (canvas.width - food.radius * 2) + food.radius;
        food.y = Math.random() * (canvas.height - food.radius * 2) + food.radius;

        // 뱀의 몸통에 새 원을 추가하여 길이를 증가시킴
        var lastCircle = circles[circles.length - 1];
        var newCircle = {
            x: lastCircle.x - lastCircle.radius * 2, // x 좌표를 충분히 떨어뜨림
            y: lastCircle.y, // y 좌표는 동일하게 유지
            radius: 20, // 새 원의 반지름을 설정
            speed: lastCircle.speed, // 마지막 원과 동일한 속도를 사용
            color: lastCircle.color // 마지막 원과 동일한 색상을 사용
        };
        circles.push(newCircle); // 뱀의 몸통에 새 원을 추가

        // 뱀의 길이를 표시하는 DOM 요소를 업데이트
        lengthEl.innerText = circles.length;
    }
}

//마우스 관련 함수
function checkCollisionWithMouse(circle) { // 마우스의 위치와 원의 위치를 비교하여 충돌 여부를 검사하는 함수
    var dx = circle.x - mouseX;
    var dy = circle.y - mouseY;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance < circle.radius;
}

// 마우스 클릭 별 이벤트 함수
canvas.addEventListener('mousemove', function (event) {
    var rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});


canvas.addEventListener('mousedown', function (event) {
    if (event.button === 0) {
        isMouseDown = true;
    }
});

canvas.addEventListener('mouseup', function (event) {
    if (event.button === 0) {
        isMouseDown = false;
        speedMultiplier = 1;
    }
});

//게이지 관련 함수
//게이지 업데이트
function updateSpeedGauge() {
    var gaugeWidthPercentage = (currentSpeedGauge / speedGaugeMax) * 100;
    speedGauge.style.width = gaugeWidthPercentage + '%';
}
// 타이머 업데이트 함수
function updateTimer() {  // 게임 타이머를 업데이트하는 함수입니다.

    var delta = Math.floor((Date.now() - startTime) / 1000);
    timeEl.innerText = delta;
}

//장애물 관련 함수
// 1. 장애물 정의 및 생성
function createObstacle() {
    var type = ['triangle', 'rectangle', 'circle'][Math.floor(Math.random() * 3)];
    var side = Math.floor(Math.random() * 4); // 0: 위, 1: 오른쪽, 2: 아래, 3: 왼쪽
    var position;
    switch (side) {
        case 0: position = { x: Math.random() * canvas.width, y: -50 }; break; // 위
        case 1: position = { x: canvas.width + 50, y: Math.random() * canvas.height }; break; // 오른쪽
        case 2: position = { x: Math.random() * canvas.width, y: canvas.height + 50 }; break; // 아래
        case 3: position = { x: -50, y: Math.random() * canvas.height }; break; // 왼쪽
    }
    var obstacle = {
        x: position.x,
        y: position.y,
        type: type,
        rotation: 0,
        speed: 1 + Math.random(), // 초기 속도 랜덤 설정
        direction: Math.atan2(canvas.height / 2 - position.y, canvas.width / 2 - position.x)
    };
    obstacles.push(obstacle);
}

// 2. 장애물 그리기 및 애니메이션
function drawObstacle(obstacle) {
    context.save();
    context.translate(obstacle.x, obstacle.y);
    context.rotate(obstacle.rotation);
    context.beginPath();
    if (obstacle.type === 'triangle') {
        context.moveTo(-10, -10);
        context.lineTo(10, -10);
        context.lineTo(0, 10);
    } else if (obstacle.type === 'rectangle') {
        context.rect(-10, -10, 20, 20);
    } else if (obstacle.type === 'circle') {
        context.arc(0, 0, 10, 0, 2 * Math.PI);
    }
    context.closePath();
    context.fillStyle = 'black';
    context.fill();
    context.restore();

    // 업데이트 로직
    obstacle.x += Math.cos(obstacle.direction) * obstacle.speed;
    obstacle.y += Math.sin(obstacle.direction) * obstacle.speed;
    obstacle.rotation += 0.05; // 회전 속도
}
// 3. 장애물 간 충돌 처리
function checkObstacleCollision() {
    // 간단한 충돌 감지 및 방향 변경 로직
    obstacles.forEach((obstacle, idx) => {
        for (let i = 0; i < obstacles.length; i++) {
            if (i != idx) {
                let other = obstacles[i];
                if (Math.hypot(obstacle.x - other.x, obstacle.y - other.y) < 20) {
                    obstacle.direction += Math.PI / 2; // 방향 변경
                }
            }
        }
    });
}
// 4. 게임 난이도 조정
function updateDifficulty() {
    var currentTime = Math.floor((Date.now() - startTime) / 1000);
    if (currentTime % 20 === 0) { // 20초마다 난이도 상승
        obstacles.forEach(obstacle => {
            obstacle.speed += 0.2; // 속도 증가
        });
    }
}
function checkCollisionWithObstacle(circle) {
    for (let obstacle of obstacles) {
        let dx = circle.x - obstacle.x;
        let dy = circle.y - obstacle.y;
        if (Math.sqrt(dx * dx + dy * dy) < 13 + 10) { // 가정: 뱀과 장애물의 반경
            return true;
        }
    }
    return false;
}

// 초기 애니메이션 프레임 ID를 저장하기 위한 변수
window.animationFrameId = null;
GameLoop();