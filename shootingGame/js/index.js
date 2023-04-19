// 元素相关
var container = document.getElementById("game");
var levelText = document.querySelector(".game-level");
var nextLevelText = document.querySelector(".game-next-level");
var scoreText = document.querySelector(".game-info .score");
var finalScoreText = document.querySelector(".game-info-text .score");
var totalScoreText = document.querySelector(".game-failed .score");
//画布相关
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var canvasWidth = canvas.clientWidth;
var canvasHeight = canvas.clientHeight;
//判断是否有requestAnimationFrame方法，若有则模拟实现
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 30);
  };
//得到对象的水平边界
function getHorizontalBoundary(target) {
  var min, max;
  target.forEach(function(size) {
    if (!min && !max) {
      min = max = size.x;
    } else {
      if (size.x < min) {
        min = size.x;
      }
      if (size.x > max) {
        max = size.x;
      }
    }
  });
  return {
    minX: min,
    maxX: max
  };
}
/**
 * 子类 键盘 对象
 */
var KeyBoard = function() {
  document.onkeydown = this.keydown.bind(this);
  document.onkeyup = this.keyup.bind(this);
};
/**
 * 键盘对象原型
 */
KeyBoard.prototype = {
  pressedLeft: false,
  pressedRight: false,
  heldLeft: false,
  heldRight: false,
  pressedSpace: false,
  keydown: function(key) {
    var keyCode = key.keyCode;
    switch (keyCode) {
      case 32:
        this.pressedSpace = true;
        break;
      case 37:
        this.pressedLeft = true;
        this.heldLeft = true;
        break;
      case 39:
        this.pressedRight = true;
        this.heldRight = true;
        break;
    }
  },
  keyup: function(key) {
    var keyCode = key.keyCode;
    switch (keyCode) {
      case 32:
        this.pressedSpace = false;
        break;
      case 37:
        this.heldLeft = false;
        this.pressedLeft = false;
        break;
      case 39:
        this.heldRight = false;
        this.pressedRight = false;
        break;
    }
  }
};
/**
 * 游戏对象
 */
var GAME = {
  /**
   * 游戏初始化
   */
  init: function(opts) {
    // 设置opts
    var opts = Object.assign({}, opts, CONFIG);
    this.opts = opts;
    var canvasPadding = opts.canvasPadding;
    this.padding = canvasPadding;
    // 设置敌人移动范围
    this.enemyLimitY = canvasHeight - canvasPadding - opts.planeSize.height;
    this.enemyMinX = canvasPadding;
    this.enemyMaxX = canvasWidth - canvasPadding - opts.enemySize;
    // 计算飞机移动范围
    var planeWidth = opts.planeSize.width;
    this.planeMinX = canvasPadding;
    this.planeMaxX = canvasWidth - canvasPadding - planeWidth;
    // 计算飞机初始坐标
    this.planePosX = canvasWidth / 2 - planeWidth;
    this.planePosY = this.enemyLimitY;
    // 分数初始化
    this.score = 0;
    // 继承KeyBoard方法
    this.keyBoard = new KeyBoard();
    this.status = "start";
    this.bindEvent();
    this.renderLevel();
  },
  /**
   * 基本事件绑定
   */
  bindEvent: function() {
    var self = this;
    var playBtn = document.querySelector(".js-play");
    var replayBtn = document.querySelectorAll(".js-replay");
    var nextBtn = document.querySelector(".js-next");
    // 点击开始按钮
    playBtn.onclick = function() {
      self.play();
    };
    // 重新开始或再玩一次，从头开始
    replayBtn.forEach(function(e) {
      e.onclick = function() {
        self.opts.level = 1;
        self.play();
        self.score = 0;
        totalScoreText.innerText = self.score;
      };
    });
    // 点击继续游戏按钮，游戏关数一级一级往上加
    nextBtn.onclick = function() {
      self.opts.level += 1;
      self.play();
    };
  },
  // 设置游戏状态
  setStatus: function(status) {
    this.status = status;
    container.setAttribute("data-status", status);
  },
  // 开始游戏
  play: function() {
    var opts = this.opts;
    var self = this;
    var padding = this.padding;
    var level = opts.level;
    var numPerLine = opts.numPerLine;
    var enemyGap = opts.enemyGap;
    var enemySize = opts.enemySize;
    var enemySpeed = opts.enemySpeed;
    this.enemies = [];
    for (var i = 0; i < level; i++) {
      for (var j = 0; j < numPerLine; j++) {
        var obj = {
          x: padding + j * (enemySize + enemyGap),
          y: padding + i * (enemySize + enemyGap),
          size: enemySize,
          speed: enemySpeed
        };
        this.enemies.push(new Enemy(obj));
      }
    }
    this.plane = new Plane({
      x: this.planePosX,
      y: this.planePosY,
      size: opts.planeSize,
      minX: this.planeMinX,
      speed: opts.planeSpeed,
      maxX: this.planeMaxX
    });
    this.setStatus("playing");
    this.renderLevel();
    this.update();
  },
  // 游戏结束
  end: function(status) {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.setStatus(status);
  },
  // 更新游戏
  update: function() {
    var self = this;
    var opts = this.opts;
    var enemies = this.enemies;
    // 清理画布
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.updatePlane();
    this.updateEnemies();
    // 绘制画布
    this.draw();
    if (enemies.length === 0) {
      if (self.opts.level === self.opts.totalLevel) {
        this.end("all-success");
      } else {
        this.end("success");
      }
      return;
    }
    if (enemies[enemies.length - 1].y >= this.enemyLimitY) {
      this.end("failed");
      return;
    }
    // 动画循环
    requestAnimationFrame(function() {
      self.update();
    });
  },
  // 更新飞机
  updatePlane: function() {
    var plane = this.plane;
    var keyBoard = this.keyBoard;
    if (KeyBoard.pressedLeft || keyBoard.heldLeft) {
      plane.translate("left");
    }
    if (keyBoard.pressedRight || keyBoard.heldRight) {
      plane.translate("right");
    }
    if (keyBoard.pressedSpace) {
      keyBoard.pressedSpace = false;
      plane.shoot();
    }
  },
  // 更新敌人
  updateEnemies: function() {
    var opts = this.opts;
    var enemies = this.enemies;
    var plane = this.plane;
    var len = enemies.length;
    var hitEdge = false;
    var getBoundary = getHorizontalBoundary(enemies);
    if (
      getBoundary.minX < this.enemyMinX ||
      getBoundary.maxX > this.enemyMaxX
    ) {
      opts.enemyDirection = opts.enemyDirection === "right" ? "left" : "right";
      hitEdge = true;
    }
    while (len--) {
      var enemy = enemies[len];
      // 碰到边缘了则往下运动
      if (hitEdge) {
        enemy.down();
      }
      enemy.translate(opts.enemyDirection);
      // 敌人的三个状态
      switch (enemy.status) {
        case "normal":
          if (plane.hasHit(enemy)) {
            enemy.booming();
          }
          break;
        case "booming":
          enemy.booming();
          break;
        // 敌人爆炸后，消除敌人并分数加1
        case "boomed":
          this.enemies.splice(len, 1);
          this.score += 1;
      }
    }
  },
  // 绘画分数、飞机和敌人
  draw: function() {
    this.renderScore();
    this.plane.draw();
    this.enemies.forEach(function(enemy) {
      enemy.draw();
    });
  },
  // 渲染游戏关数
  renderLevel: function() {
    levelText.innerText = "当前Level： " + this.opts.level;
    nextLevelText.innerText = "下一个Level： " + (this.opts.level + 1);
  },
  // 渲染分数和最终分数
  renderScore: function() {
    scoreText.innerText = this.score;
    finalScoreText.innerText = this.score;
  }
};
GAME.init();
