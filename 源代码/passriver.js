var canvas = document.getElementById('mycanvas'),
    scaleType = document.getElementsByName("scaleType"),
    context = canvas.getContext('2d'),
    haha = document.getElementById('haha'),
    hulu = document.getElementById('hulu'),
    dahai = document.getElementById('dahai'),
    luagh = document.getElementById('luagh'),
    cry = document.getElementById('cry'),
    banana=document.getElementById('banana'),
    vol = document.getElementById('vol'),

    image = new Image(),
    image2 = new Image(),
    image3 = new Image(),
    image4 = new Image(),
    image5 = new Image(),
    image6 = new Image();

var style = window.getComputedStyle(mycanvas),
    mystyle = window.getComputedStyle(canvas),
    borderLeft = style.borderLeft,
    borderTop = style.borderTop,
    paddingLeft = style.paddingLeft,
    paddingTop = style.paddingTop,
    volumn=true;

var alertion=false;


var i = 447.2; // 初始高度
var scale = 1, step = 2;
var woodlen; // 木板的长度
var l, r; // 已放置木板左右坐标
var woodNum = 1; // 分数
var animation,
    keymap = [];
var flag=0;//判断播放哪一个音频
var a;//用于step的增加

image.src = 'minions.jpg';
image2.src = 'begin.png';
image3.src = 'water.jpg';
image4.src = 'mutou.png';
image5.src = 'banana.jpg';
image6.src = 'false.jpg';


//音频循环播放
haha.loop=true;
hulu.loop=true;
dahai.loop=true;
banana.loop=true;
luagh.loop=false;
cry.loop=false;

//初始界面
image4.onload = function (ev) {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    context.save();
    context.globalAlpha = 0.4;
    context.drawImage(image2, 230, 170, image2.width * 0.5, image2.height * 0.5);//初始界面的开始图标
    context.restore();
};

//坐标转换函数
function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    x -= bbox.left;
    y -= bbox.top;
    x -= parseFloat(mystyle.borderLeftWidth);
    y -= parseFloat(mystyle.borderTopWidth);
    x -= parseFloat(mystyle.paddingLeft);
    y -= parseFloat(mystyle.paddingTop);
    x *= canvas.width / (parseFloat(mystyle['width']));
    y *= canvas.height / (parseFloat(mystyle['height']));
    return {
        x: x,
        y: y
    }
}

function saveDrawingSurface() {
    drawingSurfaceImageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreDrawingSurface() {
    context.putImageData(drawingSurfaceImageData, 0, 0);
}



//鼠标移动到开始图标上时，图标颜色加深
var move = function (e) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    var loc = windowToCanvas(e.clientX, e.clientY);
    x0 = loc.x;
    y0 = loc.y;
    if (!(x0 > 230 && x0 < 378 && y0 > 170 && y0 < 457)) {
        context.save();
        context.globalAlpha = 0.4;
        context.drawImage(image2, 230, 170, image2.width * 0.5, image2.height * 0.5);
        context.restore();
    }
    else {
        // 鼠标在图标上
        context.save();
        context.globalAlpha = 0.7;
        context.drawImage(image2, 230, 170, image2.width * 0.5, image2.height * 0.5);
        context.restore();
    }

    
    if((x0>=157&&x0<=206)&&(y0>=389&&y0<=495)&&volumn===true){//鼠标在左下角睡觉的小黄人身上
        hulu.play();
    }
    else{
        hulu.pause();
        hulu.currentTime=0;//音频从头播放
    }

    if((x0>=80&&x0<=140)&&(y0>=430&&y0<=495)&&volumn===true){//鼠标在左下角中间的小黄人身上
        banana.play();
    }
    else{
        banana.pause();
        banana.currentTime=0;//音频从头播放
    }

    if(x0>=20&&x0<=580&&y0>=5&&y0<=363&&volumn===true){//鼠标在大海区域
        dahai.play();
    }
    else{
        dahai.pause();
        dahai.currentTime=0;//音频从头播放
    }
};

var down = function (e) {
    var loc = windowToCanvas(e.clientX, e.clientY);//坐标转换
    x0 = loc.x;
    y0 = loc.y;
    if (x0 > 230 && x0 < 378 && y0 > 170 && y0 < 457) {
        init();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image3, 0, 0, canvas.width, canvas.height);      //画背景
        context.drawImage(image4, l, i + 26.4, woodlen, image4.height * 0.2);
        haha.pause();
        hulu.pause();  //开始游戏后，停止第一个界面打呼噜事件
        saveDrawingSurface();  //保存现在的界面
        canvas.removeEventListener('mousedown', down);  //移除事件down
        canvas.removeEventListener('mousemove', move);  //移除事件move
        canvas.addEventListener('mousedown', down1);    //添加down1事件到mousedown
        drawImages();
    }
};

var down1 = function (e) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    restoreDrawingSurface();  //还原刚才的界面
    if(volumn===true)
    dahai.play();
    if (scale + woodlen < l || scale > r) {
        flag=1;
        gameOver(false);//木板没有放对位置，游戏失败
        return;
    }
    //木板放在了上一块木板上，只取与上一块木板重合的部分，并更新下一块木板的长度为此重合部分的长度
    if (scale < l) {
        context.drawImage(image4, l, i, woodlen - l + scale, image4.height * 0.2);
        r = woodlen + scale;
        woodlen = woodlen - l + scale;
    }
    else {
        context.drawImage(image4, scale, i, r - scale, image4.height * 0.2);
        l = scale;
        woodlen = r - scale;
    }

    //根据难度更改速度
    if(scaleType[0].checked===true&&alertion===false) {
        a = 0.2;
        alertion=true;
    }
    if(scaleType[1].checked===true&&alertion===false) {
        a = 0.4;
        alertion=true;
    }
    if(scaleType[2].checked === true&&alertion===false){
        a=0.8;
        alertion=true;
    }

    scale = 0;
    step += a;
    i -= 26.4;
    saveDrawingSurface();
    if (++woodNum >= 19){  //根据canvas和木板的宽度，最多只能搭19块木板
        flag=2;
        gameOver(true);
    }
};

function drawImages() {
    animation = requestAnimationFrame(drawImages);
    scale += step;
    context.clearRect(0, 0, canvas.width, canvas.height);
    restoreDrawingSurface();
    if(scale>=canvas.width)
        scale%=canvas.width;  //使木块循环
    context.drawImage(image4, scale, i, woodlen, image4.height * 0.2);
    if (keymap[32] === true) {
        down1();
        keymap[32] = false;
    }
}

//每次操作后变量的变化
function init() {
    l = 200;
    r = l + woodlen;
    step = 2;
    woodlen = image4.width * 0.15;
    i = 447.2;
    r = l + woodlen;
    woodNum = 1;
    scale = 0;
}

function gameOver(result) {
    cancelAnimationFrame(animation);
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.removeEventListener('mousedown', down1);
    canvas.addEventListener('mousedown', down);
    dahai.pause();
    if (result) {
        alert("成功过河!");
        context.drawImage(image5, 0, 0, canvas.width, canvas.height);
        if(volumn===true)
        luagh.play();//播放成功音频
    } else {
        alert("失败! 搭了" + (woodNum - 1) + "根木头");
        context.drawImage(image6, 0, 0,canvas.width,canvas.height);
        if(volumn===true)
            cry.play();
    }
    init();
}

vol.onclick=function(){
    if(volumn===true){
        volumn=false;
        this.src='mute.png'
    }
    else{
        volumn=true;
        this.src='v.png'
    }
    if(volumn===true){
        if(flag==0)
        dahai.play();
        else if(flag==1){
            cry.play();
        }
        else {
            luagh.play();
        }
    }
    else{
        haha.pause();
        hulu.pause();
        dahai.pause();
        luagh.pause();
        cry.pause();
    }
}

canvas.addEventListener('mousedown', down);
canvas.addEventListener('mousemove', move);
addEventListener('keydown', function (e) {
    keymap[e.keyCode] = true;
}, false);