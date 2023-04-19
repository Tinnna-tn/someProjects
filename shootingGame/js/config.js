/**
 * 游戏相关配置
 * @type {Object}
 */
const CONFIG = {
  status: "start", // 游戏开始默认为开始中
  level: 1, // 游戏默认等级
  totalLevel: 6, // 总共6关
  numPerLine: 7, // 游戏默认每行多少个敌人
  canvasPadding: 30, // 默认画布的间隔
  planeSpeed: 5, // 默认飞机每一步移动的距离
  planeSize: {
    // 默认飞机尺寸
    width: 60,
    height: 100
  },
  bulletSize: 10, // 默认子弹尺寸
  bulletSpeed: 10, // 默认子弹的移动速度
  enemySize: 50, // 默认敌人尺寸
  enemySpeed: 2, // 默认敌人移动距离
  enemyGap: 10, // 默认敌人之间的间距
  enemyIcon: "./img/enemy.png", // 敌人的图像
  enemyBoomIcon: "./img/boom.png", // 敌人死亡的图像
  planeIcon: "./img/plane.png", // 飞机的图像
  enemyDirection: "right" // 默认敌人一开始往右移动
};
