/**
 * 子类 Enemy 射击目标对象
 */
var Enemy = function(opts) {
  var opts = opts || {};
  // 调用父类方法
  Element.call(this, opts);
  // 特有属性状态和图标
  this.status = "normal";
  this.boomCount = 0;
  this.load();
};
// 继承Element的方法
Enemy.prototype = new Element();
/**
 * 方法: down 向下移动一个身位
 */
Enemy.prototype.down = function() {
  this.move(0, this.size);
};
/**
 * 方法：load 下载敌人和敌人爆炸图
 */
Enemy.prototype.load = function() {
  if (Enemy.icon) {
    return this;
  }
  var enemyImg = new Image();
  enemyImg.src = CONFIG.enemyIcon;
  enemyImg.onload = function() {
    Enemy.icon = enemyImg;
  };
  var enemyBoomImg = new Image();
  enemyBoomImg.src = CONFIG.enemyBoomIcon;
  enemyBoomImg.onload = function() {
    Enemy.boomIcon = enemyBoomImg;
  };
  return this;
};
/**
 * 方法：translate 修改敌人当前位置
 */
Enemy.prototype.translate = function(position) {
  if (position === "left") {
    this.move(-this.speed, 0);
  } else {
    this.move(this.speed, 0);
  }
  return this;
};
/**
 * 方法：booming 敌人阵亡
 */
Enemy.prototype.booming = function() {
  this.status = "booming";
  // 记录阵亡敌人数
  this.boomCount += 1;
  if (this.boomCount > 4) {
    this.status = "boomed";
  }
};
/**
 * 方法：draw 方法
 */
Enemy.prototype.draw = function() {
  // 绘制敌人
  if (Enemy.icon && Enemy.boomIcon) {
    switch (this.status) {
      case "normal":
        context.drawImage(Enemy.icon, this.x, this.y, this.size, this.size);
        break;
      case "booming":
        context.drawImage(Enemy.boomIcon, this.x, this.y, this.size, this.size);
        break;
    }
  } else {
    context.fillRect(this.x, this.y, this.size, this.size);
  }
};
