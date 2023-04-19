/**
 * 子类 Bullet 子弹对象
 */
var Bullet = function(opts) {
  var opts = opts || {};
  Element.call(this, opts);
};
// 继承Element的方法
Bullet.prototype = new Element();
/**
 * 方法：子弹飞
 */
Bullet.prototype.fly = function() {
  this.move(0, -this.speed);
};
/**
 * 方法：画子弹
 */
Bullet.prototype.draw = function() {
  context.beginPath();
  context.strokeStyle = "#fff";
  context.moveTo(this.x, this.y);
  context.lineTo(this.x, this.y - this.size);
  context.closePath();
  context.stroke();
  return this;
};
