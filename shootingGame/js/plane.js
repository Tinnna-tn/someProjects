/**
 * 子类 Plane 飞机
 * 1.继承Element
 * 2.依赖Bullet
 */
var Plane = function(opts) {
  var opts = opts || {};
  // 调用父类方法
  Element.call(this, opts);
  this.minX = opts.minX;
  this.maxX = opts.maxX;
  // 子弹相关
  this.bulletSpeed = opts.bulletSpeed || CONFIG.bulletSpeed;
  this.bulletSize = opts.bulletSize || CONFIG.bulletSize;
  this.bullets = [];
  this.load();
};
// 继承Element方法
Plane.prototype = new Element();
/**
 * 方法：hasHit 判断是否撞击中当前元素
 * @param {target} target 目标元素实例
 */
Plane.prototype.hasHit = function(target) {
  var bullets = this.bullets;
  for (var j = bullets.length - 1; j >= 0; j--) {
    var bullet = bullets[j];
    // 判断子弹是否击中的是目标对象的范围
    var judgeX = target.x < bullet.x && bullet.x < target.x + target.size;
    var judgeY = target.y < bullet.y && bullet.y < target.y + target.size;
    // 如果子弹击中的是目标对象的范围，则销毁子弹
    if (judgeX && judgeY) {
      this.bullets.splice(j, 1);
      return true;
    }
  }
  return false;
};
/**
 * 方法：load 下载飞机
 */
Plane.prototype.load = function() {
  if (Plane.icon) {
    return this;
  }
  var planeImg = new Image();
  planeImg.src = CONFIG.planeIcon;
  planeImg.onload = function() {
    Plane.icon = planeImg;
  };
  return this;
};
/**
 * 方法：translate 修改飞机当前位置
 */
Plane.prototype.translate = function(position) {
  var speed = this.speed;
  var moving;
  if (position === "left") {
    moving = this.x < this.minX ? 0 : -speed;
  } else {
    moving = this.x > this.maxX ? 0 : speed;
  }
  this.move(moving, 0);
  return this;
};
/**
 * 方法：shoot 方法,飞机射击
 */
Plane.prototype.shoot = function() {
  // 创建子弹，子弹位置是居中射出
  var bulletX = this.x + this.size.width / 2;
  this.bullets.push(
    new Bullet({
      x: bulletX,
      y: this.y,
      size: this.bulletSize,
      speed: this.bulletSpeed
    })
  );
};
/**
 * 方法：drawBullets 画子弹
 */
Plane.prototype.drawBullets = function() {
  var bullets = this.bullets;
  var len = bullets.length;
  while (len--) {
    var bullet = bullets[len];
    // 更新子弹位置
    bullet.fly();
    // 如果子弹对象超出边界，则删除
    if (bullet.y <= 0) {
      bullets.splice(len, 1);
    } else {
      // 未超出的则绘制子弹
      bullet.draw();
    }
  }
};
/**
 * 方法：draw 方法
 */
Plane.prototype.draw = function() {
  // 绘制飞机
  if (!Plane.icon) {
    context.fillRect(this.x, this.y, this.size.width, this.size.height);
  } else {
    context.drawImage(
      Plane.icon,
      this.x,
      this.y,
      this.size.width,
      this.size.height
    );
  }
  // 绘制子弹
  this.drawBullets();
  return this;
};
