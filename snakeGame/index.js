/**
 * 点击开始游戏 --> startPage 消失 --> 游戏开始
 * 随机出现食物，出现三节蛇开始运动
 * 上下左右 --> 改变运动方向
 * 判断吃到食物 --> 食物消失，蛇加 一
 * 判断游戏结束，弹出框
 */

// 获取相关对象
let content = document.getElementById('content');
let startPage = document.getElementById('start-page');
let scoreBox = document.getElementById('score-box');
let scoreShow = document.getElementById('score');
let lose = document.getElementById('lose');
let loseScore = document.getElementById('lose-score');
let closeBtn = document.getElementById('close-btn');
let startBtn = document.getElementById('start-btn');
let startPause = document.getElementById('start-pause');
let snakeMove; // 定时器
let speed = 200;
let startGameBool = true; // 是否开始游戏
let startPauseBool = true; // 是否暂停游戏

init();

function init() {
  // 游戏场地
  this.mapW = parseInt(getComputedStyle(content).width);
  this.mapH = parseInt(getComputedStyle(content).height);
  this.mapDiv = content;

  // 食物
  this.foodW = 20; // 宽高
  this.foodH = 20;
  this.foodX = 0; // 食物随机坐标位置
  this.foodY = 0;

  // 蛇
  this.snakeW = 20;
  this.snakeH = 20;
  this.snakeBody = [[3, 1, 'head'], [2, 1, 'body'], [1, 1, 'body']] // 蛇头加蛇身

  // 游戏属性
  this.direction = 'right';
  this.left = false; // 往左右时左右不能改变，只能改变上下
  this.right = false;
  this.up = true;
  this.down = true;

  // 分数
  this.score = 0;
  bindEvent();
}

/**
 * 键盘落下判断 bindEvent
 */

function bindEvent() {
  closeBtn.onclick = function () {
    lose.style.display = 'none';
  }

  startBtn.onclick = function () {
    startAndPause();
  }
  
  startPause.onclick = function () {
    startAndPause();
  }
}

/**
 * 开始/暂停游戏 startAndPause
 */

function startAndPause() {
  if (startPauseBool) {
    if (startGameBool) {
      startGame();document.onkeydown = function (e) {
      let code = e.keyCode;
      setDirection(code);
    }
      startGameBool = false;
    }
    startPause.setAttribute('src', './img/pause.png');
    document.onkeydown = function (e) {
      let code = e.keyCode;
      setDirection(code);
    }
    snakeMove = setInterval(function() {
      move();
    }, speed);
    startPauseBool = false;
  } else { // 暂停时候
    startPause.setAttribute('src', './img/start.png');
    clearInterval(snakeMove);
    document.onkeydown = function (e) {
      e.returnValue = false;
      return false;
    }
    startPauseBool = true;
  }
}

/**
 * 游戏开始 startGame
 */

function startGame() {
  scoreShow.style.display = 'block';
  startPage.style.display = 'none';
  startPause.style.display = 'block';
  food();
  snake();
}

/**
 * 生成食物 food
 */

function food() {
  let food = document.createElement('div');
  food.style.width = this.foodW + 'px';
  food.style.height = this.foodH + 'px';
  food.style.position = 'absolute';
  this.foodX = Math.floor(Math.random() * (this.mapW / 20));
  this.foodY = Math.floor(Math.random() * (this.mapH / 20));
  food.style.left = this.foodX * 20 + 'px';
  food.style.top = this.foodY * 20 + 'px';
  this.mapDiv.appendChild(food).setAttribute('class', 'food');
}

/**
 * 生成蛇 snake
 */

function snake() {
  for(let i = 0, len = this.snakeBody.length; i < len; i ++) {
    let snake = document.createElement('div');
    snake.style.width = this.snakeW + 'px';
    snake.style.height = this.snakeH + 'px';
    snake.style.position = 'absolute';
    snake.style.left = this.snakeBody[i][0] * 20 + 'px';
    snake.style.top = this.snakeBody[i][1] * 20 + 'px';
    snake.classList.add(this.snakeBody[i][2]);
    this.mapDiv.appendChild(snake).classList.add('snake');

    // 改变蛇头方向
    switch (this.direction) {
      case 'right':
        break;
      case 'up':
        snake.style.transform = 'rotate(270deg)';
        break;
      case 'left':
        snake.style.transform = 'rotate(180deg)';
        break;
      case 'down':
        snake.style.transform = 'rotate(90deg)';
        break;
      default:
        break;
    }
  }
}

/**
 * 方向控制 setDirection
 */

function setDirection(code) {
  switch(code) {
    case 37:
      if(this.left) {
        this.direction = 'left';
        this.left = false;
        this.right = false;
        this.up = true;
        this.down = true;
      }
      break;
    case 38:
      if (this.up) {
        this.direction = 'up';
        this.left = true;
        this.right = true;
        this.up = false;
        this.down = false;
      }
      break;
    case 39:
      if (this.right) {
        this.direction = 'right';
        this.left = false;
        this.right = false;
        this.up = true;
        this.down = true;
      }
      break;
      case 40:
        if (this.down) {
            this.direction = 'down';
            this.left = true;
            this.right = true;
            this.up = false;
            this.down = false;
        }
        break;
      default:
        break;
  }
}

/**
 * 运动 move
 */

function move() {
  for(let i = this.snakeBody.length - 1; i > 0; i --) {
    this.snakeBody[i][0] = this.snakeBody[i - 1][0]; // X 轴每一位等于它前一位的值
    this.snakeBody[i][1] = this.snakeBody[i - 1][1]; // Y 轴每一位等于它前一位的值
  }

  // 判断蛇头运动方向，身是跟随这蛇头方向运动的
  switch(this.direction) {
    case 'right':
      this.snakeBody[0][0] += 1;
      break;
    case 'up':
      this.snakeBody[0][1] -= 1;
      break;
    case 'left':
      this.snakeBody[0][0] -= 1;
      break;
    case 'down':
      this.snakeBody[0][1] += 1;
      break;
    default:
      break;
  }

  removeClass('snake'); // 把原来的蛇删掉
  snake(); // 重新渲染一条蛇

  // 判断蛇头是否碰到食物
  if (this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY) {
    // 吃到一次食物蛇身增加一个
    let snakeEndX = this.snakeBody[this.snakeBody.length - 1][0];
    let snakeEndY = this.snakeBody[this.snakeBody.length - 1][1];
    
    switch (this.direction) {
      case 'right':
        this.snakeBody.push([snakeEndX + 1, snakeEndY, 'body']);
        break;
      case 'up':
        this.snakeBody.push([snakeEndX, snakeEndY - 1, 'body']);
        break;
      case 'left':
        this.snakeBody.push([snakeEndX - 1, snakeEndY, 'body']);
        break;
      case 'down':
        this.snakeBody.push([snakeEndX, snakeEndY + 1, 'body']);
        break;
      default:
        break;
    }

    // 分数加 1，食物消失重新渲染
    this.score += 1;
    scoreBox.innerHTML = this.score;
    removeClass('food');
    food();
  }

  // 判断蛇头是否碰到边界或蛇身体
  if (this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW / 20) {
    reload();
  }
  if (this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH / 20) {
    reload();
  }
  let snakeHX = this.snakeBody[0][0];
  let snakeHY = this.snakeBody[0][1];

  // 从蛇头后的第一位开始循环判断
  for (let i = 1, len = this.snakeBody.length; i < len; i ++) {
    if (snakeHX == this.snakeBody[i][0] && snakeHY == this.snakeBody[i][1]) {
      reload();
    }
  }
}

/**
 * 重新加载游戏 reload
 */

function reload() {
  removeClass('snake');
  removeClass('food');
  clearInterval(snakeMove);
  this.snakeBody = [[3, 1, 'head'], [2, 1, 'body'], [1, 1, 'body']];
  this.direction = 'right';
  this.left = false;
  this.right = false;
  this.up = true;
  this.down = true;
  lose.style.display = 'block';
  loseScore.innerHTML = this.score;
  this.score = 0;
  scoreBox.innerHTML = this.score;
  startGameBool = true;
  startPauseBool = true;
  startPause.setAttribute('src', './img/start.png');
}

/**
 * removeClass
 */
function removeClass(className) {
  let ele = document.getElementsByClassName(className);
  while (ele.length > 0) {
    ele[0].parentNode.removeChild(ele[0]);
  }
}