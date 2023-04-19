/**
 * 1、点击开始游戏 -> 动态生成 100 个小格 -> 100 个 div
 * 2、leftClick 
 *    -> 没有雷 -> 展示数字（代表以当前小格为中心周围8个格的雷数）
 *               是 0 则扩散一片（当前周围8个格没有雷）
 *    有雷 -> game over
 * 3、rightClick 
 *    -> 没有标记且无数字 -> 进行标记
 *    -> 有标记 -> 取消标记 
 *       标记是否正确，10 个都标记正确 -> 提示成功
 * 4、已经出现数字的 -> 无法标记
 */

 // 获取相关对象
let beginBtn = document.getElementById('begin-btn');
let box = document.getElementById('box');
let flagBox = document.getElementById('flagBox');
let alertBox = document.getElementById('alertBox');
let alertImg = document.getElementById('alertImg');
let closeBtn = document.getElementById('close-btn');
let score = document.getElementById('score');
let minesNum; // 雷的数量
let mineOver; // 已经标记出的雷的数量
let block;
let mineMap = [];
let startGame = true;

/**
 * bindEvent 函数：存放所有点击相关
 */
bindEvent();

function bindEvent() {
  beginBtn.onclick = function() {
    if (startGame) {
      box.style.display = 'block';
      flagBox.style.display = 'block';
      init(); 
      startGame = false;
    }
  }

  // 取消鼠标默认的右键事件 --> 点击出现菜单
  box.oncontextmenu = function () {
    return false;
  }

  // 利用事件委托找到事件源，就能找到那个小格子，点击时得判断是左击还是右击
  box.onmousedown = function (e) {
    var event = e.target;
    // 为 1 时代表左键点击
    if (e.which === 1) {
      leftClick(event);
    } else if (e.which === 3) {
      rightClick(event);
    }
  }

  // 点击关闭按钮，整个游戏界面都消失
  closeBtn.onclick = function() {
    box.style.display = 'none';
    flagBox.style.display = 'none';
    alertBox.style.display = 'none';
    box.innerHTML = '';
    startGame = true;
  }
}

/**
 * 初始化函数，生成 100 个小格，且随机抽 10 个放雷
 */

function init() {
  // 以下两变量一开始均为 10
  minesNum = 10;
  mineOver = 10;
  score.innerHTML = mineOver;
  // 生成 100 个小格，两个 for 循环，一个生成 10 行，一个生成 10 列
  for(let i = 0; i < 10; i ++) {
    for(let j = 0; j < 10; j ++) {
      let oDiv = document.createElement('div');
      oDiv.classList.add('block'); // 存放相同样式
      oDiv.setAttribute('id', i + '-' + j); // 每个有自己的 id：记录当前行和列的值，第几行第几列
      box.appendChild(oDiv);
      mineMap.push({mine: 0}); // 最开始给每个小格雷的状态都标记为 0
    }
  }

  // 生成雷 --> 100 个里随机选 10 个
  block = document.getElementsByClassName('block');  // 类数组 100 个格
  while(minesNum) {
    // 随机标记一个雷要出现的位置
    let mineIndex = Math.floor(Math.random() * 100);
    // 判断随机的某个小格是否已经有雷，若已有则不再在此位置放雷，若没有则可以放雷
    if (mineMap[mineIndex].mine === 0) {
      mineMap[mineIndex].mine = 1;
      block[mineIndex].classList.add('isLei'); // 增加一个类名表示这是个雷
      minesNum --;
    }
  }
}

/**
 * leftClick 左键点击
 * @param dom 代表当前哪个小格子被点击了
 */

function leftClick(dom) {
  if (dom.classList.contains('flag')) return;

  let isLei = document.getElementsByClassName('isLei');

  // 代表点击到有雷的小格子了
  if (dom && dom.classList.contains('isLei')) {
    // 所有雷都显示出来
    for (let i = 0, len = isLei.length; i < len; i ++) {
      isLei[i].classList.add('show');
    }
    // 显示 gameover 图片
    setTimeout(function () {
      alertBox.style.display = 'block';
      alertImg.style.backgroundImage = 'url(./img/over.jpg)';
    }, 800);
  } else {
    let n = 0;
    // 根据小格子的 id 来放位置
    let posArr = dom && dom.getAttribute('id').split('-');
    let posX = posArr && +posArr[0]; // 行
    let posY = posArr && +posArr[1];  // 列
    dom && dom.classList.add('num');
    /**
     * 周围 8 个的坐标值
     * (i-1,j-1)  (i-1,j)  (i-1,j+1)
     * (i,j-1)    (i,j)    (i,j+1)
     * (i+1,j-1)  (i+1,j)  (i+1,j+1)
     */
    for (let i = posX - 1; i <= posX + 1; i ++) {
      for (let j = posY - 1; j <= posY + 1; j ++) {
        let arroundBox = document.getElementById(i + '-' + j);
        if (arroundBox && arroundBox.classList.contains('isLei')) {
          n ++;
        }
      }
    } 
    dom && (dom.innerHTML = n);
    // 当数字为 0 时
    if (n == 0) {
      for (let i = posX - 1; i <= posX + 1 ; i ++) {
        for (let j = posY - 1; j <= posY + 1; j ++) {
          let nearBox = document.getElementById(i + '-' + j);
          if (nearBox && nearBox.length != 0) {
            if (!nearBox.classList.contains('check')) {
              // 已经点过显示出来的，加个标记
              nearBox.classList.add('check');
              leftClick(nearBox);
            }
          }
        }
      }
    }
  }
}

/**
 * rightClick 左键点击
 * @param dom 代表当前哪个小格子被点击了
 * 插旗标记雷
 */
function rightClick (dom) {
  // 有数子的格子不能插旗
  if (dom.classList.contains('num')) return;
  dom.classList.toggle('flag');
  if (dom.classList.contains('isLei') && dom.classList.contains('flag')) {
    mineOver --;
  }
  if (dom.classList.contains('isLei') && !dom.classList.contains('flag')) {
    mineOver ++;
  }
  score.innerHTML = mineOver;
  if (mineOver == 0) {
    alertBox.style.display = 'block';
    alertImg.style.backgroundImage = 'url(./img/success.png)';
  }
}